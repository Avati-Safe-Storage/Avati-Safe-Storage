// ============================================================
//  AVATI SAFE STORAGE — Google Apps Script v3.0
//  Full customer journey: Lead → Customer → Pickup → Storage → Items → Payments
// ============================================================
//  SETUP:
//  1. script.google.com → New Project → Paste this file
//  2. Fill in SPREADSHEET_ID and DRIVE_FOLDER_ID below
//  3. Deploy → New Deployment → Web App → Anyone → Copy URL
//  4. Add URL to .env as VITE_APPS_SCRIPT_URL
// ============================================================

const SPREADSHEET_ID  = 'YOUR_SHEET_ID_HERE';
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE';

const SH = {
  LEADS:    'Leads',
  CUST:     'Customers',
  PICKUPS:  'Pickups',
  STAFF:    'Staff',
  STORAGE:  'Storage',
  ITEMS:    'Items',
  PAYMENTS: 'Payments',
  COUNTERS: 'Counters',
  LOG:      'Activity Log',
};

// ── Response & Router ────────────────────────────────────────

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const p = e.parameter, a = p.action;
    if (a === 'getLeads')      return json(getLeads());
    if (a === 'getCustomers')  return json(getCustomers());
    if (a === 'getPickups')    return json(getPickups());
    if (a === 'getStorage')    return json(getStorageList());
    if (a === 'getItems')      return json(getItems(p.storageId, p.customerId));
    if (a === 'getPayments')   return json(getPayments(p.customerId));
    if (a === 'getStaff')      return json(getStaff());
    if (a === 'getStats')      return json(getStats());
    if (a === 'getPortalData') return json(getPortalData(p.customerId));
    return json({ error: 'Unknown action' });
  } catch(e) { return json({ error: String(e) }); }
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents), a = b.action;
    if (a === 'addLead')             return json(addLead(b.data));
    if (a === 'updateLeadStatus')    return json(updateLeadStatus(b.id, b.status, b.notes));
    if (a === 'addCustomer')         return json(addCustomer(b.data));
    if (a === 'updateCustomer')      return json(updateCustomer(b.data));
    if (a === 'deleteCustomer')      return json(deleteRow(SH.CUST, b.id));
    if (a === 'addPickup')           return json(addPickup(b.data));
    if (a === 'updatePickup')        return json(updatePickup(b.data));
    if (a === 'completePickup')      return json(completePickup(b.pickupId, b.customerId));
    if (a === 'addStorage')          return json(addStorage(b.data));
    if (a === 'updateStorage')       return json(updateStorage(b.data));
    if (a === 'addItems')            return json(addItems(b.items));
    if (a === 'updateItemStatus')    return json(updateItemStatus(b.id, b.status));
    if (a === 'addPayment')          return json(addPayment(b.data));
    if (a === 'validateLogin')       return json(validateLogin(b.loginId, b.password));
    return json({ success: false, error: 'Unknown action: ' + a });
  } catch(e) { return json({ success: false, error: String(e) }); }
}

// ── ID Generator ─────────────────────────────────────────────

function nextId(prefix) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(SH.COUNTERS);
  if (!sh) { sh = ss.insertSheet(SH.COUNTERS); sh.appendRow(['Prefix', 'Counter']); }
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === prefix) {
      const next = Number(data[i][1]) + 1;
      sh.getRange(i + 1, 2).setValue(next);
      return `${prefix}-${String(next).padStart(4, '0')}`;
    }
  }
  sh.appendRow([prefix, 1]);
  return `${prefix}-0001`;
}

function nextItemId(customerId) {
  // Item IDs reset per customer; use a per-customer counter
  return nextId('AVT-ITEM-' + customerId.replace('AVT-CUS-', ''));
}

// ── Sheet Helper ─────────────────────────────────────────────

function sheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); initHeaders(sh, name); }
  return sh;
}

function initHeaders(sh, name) {
  const heads = {
    [SH.LEADS]:    ['ID','Name','Phone','Email','StorageType','Plan','Area','PickupDate','Duration','Packing','Transport','Distance','LiftAvail','Floors','InventoryJson','MonthlyEst','TotalEst','Status','Notes','CreatedAt','ConvertedCustomerId'],
    [SH.CUST]:     ['ID','LeadID','Name','Company','Phone','AltPhone','Email','KycType','KycId','GSTIN','StartDate','Insurance','Status','LoginId','Password','DriveFolder','PickupID','StorageID','Notes','CreatedAt'],
    [SH.PICKUPS]:  ['ID','CustomerID','CustomerName','Address','Floor','LiftAvail','PickupDate','PreferredTime','AdvanceAmt','AdvancePayID','StaffNames','Vehicle','Labours','Status','CompletedAt','Notes','CreatedAt'],
    [SH.STAFF]:    ['ID','Name','Phone','Role','Vehicle','Available'],
    [SH.STORAGE]:  ['ID','CustomerID','CustomerName','Warehouse','Row','Section','Location','Plan','StorageType','Insurance','StartDate','ItemCount','MonthlyRate','Status','Notes','CreatedAt'],
    [SH.ITEMS]:    ['ID','CustomerID','StorageID','ItemDefId','Name','Category','Description','Options','Quantity','Unit','Condition','PhotoUrls','IsExtra','Status','Notes','AddedAt'],
    [SH.PAYMENTS]: ['ID','CustomerID','Type','Amount','GSTAmt','TotalAmount','PaidOn','DueDate','Status','Description','InvoiceURL','BillingPeriod','CreatedAt'],
    [SH.LOG]:      ['Timestamp','Action','EntityType','EntityID','Details'],
  };
  if (heads[name]) {
    sh.appendRow(heads[name]);
    sh.getRange(1,1,1,heads[name].length).setFontWeight('bold').setBackground('#0B1F3A').setFontColor('#D4AF37');
  }
}

function rows(name) {
  const sh = sheet(name);
  const data = sh.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).filter(r => r[0]).map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i]; });
    return obj;
  });
}

function deleteRow(shName, id) {
  const sh = sheet(shName);
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) { sh.deleteRow(i + 1); return { success: true }; }
  }
  return { success: false, error: 'Not found' };
}

function log(action, type, id, details) {
  try { sheet(SH.LOG).appendRow([new Date().toISOString(), action, type, id, details]); } catch(_){}
}

// ── Drive ────────────────────────────────────────────────────

function createCustomerFolder(id, name) {
  try {
    const root = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const f = root.createFolder(id + ' – ' + name);
    f.createFolder('KYC Documents');
    f.createFolder('Contracts');
    f.createFolder('Invoices');
    f.createFolder('Item Photos');
    f.createFolder('Pickup Videos');
    return f.getUrl();
  } catch(e) { return ''; }
}

// ── LEADS ────────────────────────────────────────────────────

function getLeads() {
  return rows(SH.LEADS).map(r => ({
    id: r.ID, name: r.Name, phone: r.Phone, email: r.Email,
    storageType: r.StorageType, plan: r.Plan, area: r.Area,
    pickupDate: r.PickupDate, duration: r.Duration,
    packingRequired: r.Packing === true, transportRequired: r.Transport === true,
    distance: r.Distance, liftAvailable: r.LiftAvail, floors: r.Floors,
    inventoryJson: r.InventoryJson, monthlyEstimate: r.MonthlyEst, totalEstimate: r.TotalEst,
    status: r.Status, notes: r.Notes, createdAt: r.CreatedAt, convertedCustomerId: r.ConvertedCustomerId,
  }));
}

function addLead(d) {
  const id = nextId('AVT-LEAD');
  sheet(SH.LEADS).appendRow([
    id, d.name, d.phone, d.email, d.storageType, d.plan, d.area,
    d.pickupDate||'', d.duration||'', d.packingRequired||false, d.transportRequired||false,
    d.distance||0, d.liftAvailable||'', d.floors||0, d.inventoryJson||'',
    d.monthlyEstimate||0, d.totalEstimate||0, d.status||'New', d.notes||'',
    new Date().toISOString(), '',
  ]);
  log('ADD_LEAD','Lead',id,d.name);
  return { success: true, id };
}

function updateLeadStatus(id, status, notes) {
  const sh = sheet(SH.LEADS), data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sh.getRange(i+1, 19).setValue(status);                    // Status col
      if (notes) sh.getRange(i+1, 20).setValue(notes);
      return { success: true };
    }
  }
  return { success: false };
}

// ── CUSTOMERS ────────────────────────────────────────────────

function getCustomers() {
  return rows(SH.CUST).map(r => ({
    id: r.ID, leadId: r.LeadID, name: r.Name, company: r.Company,
    phone: r.Phone, altPhone: r.AltPhone, email: r.Email,
    kycType: r.KycType, kycId: r.KycId, gstin: r.GSTIN,
    startDate: r.StartDate, insuranceRequired: r.Insurance === true,
    status: r.Status, loginId: r.LoginId, password: r.Password,
    driveFolder: r.DriveFolder, pickupId: r.PickupID, storageId: r.StorageID,
    notes: r.Notes, createdAt: r.CreatedAt,
  }));
}

function addCustomer(d) {
  const id = nextId('AVT-CUS');
  const driveUrl = createCustomerFolder(id, d.name || d.company || id);
  sheet(SH.CUST).appendRow([
    id, d.leadId||'', d.name||'', d.company||'', d.phone||'', d.altPhone||'',
    d.email||'', d.kycType||'', d.kycId||'', d.gstin||'',
    d.startDate||'', d.insuranceRequired||false, d.status||'Onboarding',
    d.loginId||'', d.password||'', driveUrl, '','', d.notes||'',
    new Date().toISOString(),
  ]);
  // Mark lead as converted
  if (d.leadId) {
    const sh = sheet(SH.LEADS), data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === d.leadId) { sh.getRange(i+1,19).setValue('Converted'); sh.getRange(i+1,21).setValue(id); break; }
    }
  }
  log('ADD_CUSTOMER','Customer',id,d.name);
  return { success: true, id, driveUrl };
}

function updateCustomer(d) {
  const sh = sheet(SH.CUST), data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === d.id) {
      const cols = { Status:13, PickupID:17, StorageID:18 };
      if (d.status)    sh.getRange(i+1,cols.Status).setValue(d.status);
      if (d.pickupId)  sh.getRange(i+1,cols.PickupID).setValue(d.pickupId);
      if (d.storageId) sh.getRange(i+1,cols.StorageID).setValue(d.storageId);
      return { success: true };
    }
  }
  return { success: false };
}

// ── PICKUPS ──────────────────────────────────────────────────

function getPickups() {
  return rows(SH.PICKUPS).map(r => ({
    id: r.ID, customerId: r.CustomerID, customerName: r.CustomerName,
    address: r.Address, floor: r.Floor, liftAvailable: r.LiftAvail === true,
    pickupDate: r.PickupDate, preferredTime: r.PreferredTime,
    advanceAmount: Number(r.AdvanceAmt), advancePaymentId: r.AdvancePayID,
    staffNames: r.StaffNames, vehicleNumber: r.Vehicle, labours: r.Labours,
    status: r.Status, completedAt: r.CompletedAt, notes: r.Notes, createdAt: r.CreatedAt,
  }));
}

function addPickup(d) {
  const id = nextId('AVT-PKP');
  sheet(SH.PICKUPS).appendRow([
    id, d.customerId, d.customerName||'', d.address||'', d.floor||'',
    d.liftAvailable||false, d.pickupDate||'', d.preferredTime||'',
    d.advanceAmount||0, d.advancePaymentId||'', d.staffNames||'',
    d.vehicleNumber||'', d.labours||'', d.status||'Scheduled', '', d.notes||'',
    new Date().toISOString(),
  ]);
  // Update customer pickupId
  updateCustomer({ id: d.customerId, pickupId: id, status: 'Pickup Scheduled' });
  log('ADD_PICKUP','Pickup',id,d.customerName);
  return { success: true, id };
}

function completePickup(pickupId, customerId) {
  const sh = sheet(SH.PICKUPS), data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === pickupId) {
      sh.getRange(i+1,14).setValue('Completed');
      sh.getRange(i+1,15).setValue(new Date().toISOString().split('T')[0]);
      break;
    }
  }
  updateCustomer({ id: customerId, status: 'Pickup Completed' });
  log('COMPLETE_PICKUP','Pickup',pickupId,'Completed');
  return { success: true };
}

function updatePickup(d) {
  const sh = sheet(SH.PICKUPS), data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === d.id) {
      if (d.status)      sh.getRange(i+1,14).setValue(d.status);
      if (d.staffNames)  sh.getRange(i+1,11).setValue(d.staffNames);
      if (d.vehicleNumber) sh.getRange(i+1,12).setValue(d.vehicleNumber);
      return { success: true };
    }
  }
  return { success: false };
}

// ── STORAGE ──────────────────────────────────────────────────

function getStorageList() {
  return rows(SH.STORAGE).map(r => ({
    id: r.ID, customerId: r.CustomerID, customerName: r.CustomerName,
    warehouse: r.Warehouse, row: r.Row, section: r.Section, location: r.Location,
    plan: r.Plan, storageType: r.StorageType, insuranceOpted: r.Insurance === true,
    startDate: r.StartDate, itemCount: Number(r.ItemCount), monthlyRate: Number(r.MonthlyRate),
    status: r.Status, notes: r.Notes, createdAt: r.CreatedAt,
  }));
}

function addStorage(d) {
  const id = nextId('AVT-STO');
  sheet(SH.STORAGE).appendRow([
    id, d.customerId, d.customerName||'', d.warehouse, d.row, d.section, d.location,
    d.plan, d.storageType, d.insuranceOpted||false, d.startDate||'',
    d.itemCount||0, d.monthlyRate||0, d.status||'Active', d.notes||'',
    new Date().toISOString(),
  ]);
  updateCustomer({ id: d.customerId, storageId: id, status: 'Storage Setup' });
  log('ADD_STORAGE','Storage',id,d.location);
  return { success: true, id };
}

function updateStorage(d) {
  const sh = sheet(SH.STORAGE), data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === d.id) {
      if (d.status)    sh.getRange(i+1,14).setValue(d.status);
      if (d.itemCount) sh.getRange(i+1,12).setValue(d.itemCount);
      return { success: true };
    }
  }
  return { success: false };
}

// ── ITEMS ────────────────────────────────────────────────────

function getItems(storageId, customerId) {
  return rows(SH.ITEMS)
    .filter(r => (!storageId || r.StorageID === storageId) && (!customerId || r.CustomerID === customerId))
    .map(r => ({
      id: r.ID, customerId: r.CustomerID, storageId: r.StorageID,
      itemDefId: r.ItemDefId, name: r.Name, category: r.Category,
      description: r.Description, options: r.Options,
      quantity: Number(r.Quantity), unit: r.Unit, condition: r.Condition,
      photoUrls: r.PhotoUrls, isExtra: r.IsExtra === true,
      status: r.Status, notes: r.Notes, addedAt: r.AddedAt,
    }));
}

function addItems(items) {
  const sh = sheet(SH.ITEMS);
  const ids = [];
  items.forEach((it, idx) => {
    const id = it.id || nextId('AVT-ITEM');
    ids.push(id);
    sh.appendRow([
      id, it.customerId, it.storageId, it.itemDefId||'', it.name||'', it.category||'',
      it.description||'', it.options||'', it.quantity||1, it.unit||'unit',
      it.condition||'Good', it.photoUrls||'', it.isExtra||false,
      it.status||'In Storage', it.notes||'', it.addedAt||new Date().toISOString().split('T')[0],
    ]);
  });
  // Update item count on storage
  if (items.length > 0) {
    const storItems = getItems(items[0].storageId, null);
    updateStorage({ id: items[0].storageId, itemCount: storItems.length, status: 'Active' });
    updateCustomer({ id: items[0].customerId, status: 'Stored' });
  }
  log('ADD_ITEMS','Items',items[0]?.storageId,`${items.length} items added`);
  return { success: true, ids };
}

function updateItemStatus(id, status) {
  const sh = sheet(SH.ITEMS), data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) { sh.getRange(i+1,14).setValue(status); return { success: true }; }
  }
  return { success: false };
}

// ── PAYMENTS ─────────────────────────────────────────────────

function getPayments(customerId) {
  return rows(SH.PAYMENTS)
    .filter(r => !customerId || r.CustomerID === customerId)
    .map(r => ({
      id: r.ID, customerId: r.CustomerID, type: r.Type,
      amount: Number(r.Amount), gstAmount: Number(r.GSTAmt), totalAmount: Number(r.TotalAmount),
      paidOn: r.PaidOn, dueDate: r.DueDate, status: r.Status,
      description: r.Description, invoiceUrl: r.InvoiceURL, billingPeriod: r.BillingPeriod,
      createdAt: r.CreatedAt,
    }));
}

function addPayment(d) {
  const id = nextId('AVT-PAY');
  sheet(SH.PAYMENTS).appendRow([
    id, d.customerId, d.type, d.amount||0, d.gstAmount||0, d.totalAmount||0,
    d.paidOn||'', d.dueDate||'', d.status||'Pending', d.description||'',
    d.invoiceUrl||'', d.billingPeriod||'', new Date().toISOString(),
  ]);
  log('ADD_PAYMENT','Payment',id,`${d.type} ₹${d.totalAmount}`);
  return { success: true, id };
}

// ── STAFF ────────────────────────────────────────────────────

function getStaff() {
  return rows(SH.STAFF).map(r => ({
    id: r.ID, name: r.Name, phone: r.Phone, role: r.Role,
    vehicleNumber: r.Vehicle, available: r.Available === true,
  }));
}

// ── PORTAL LOGIN ─────────────────────────────────────────────

function validateLogin(loginId, password) {
  const customers = getCustomers();
  const cust = customers.find(c => c.loginId === loginId && c.password === password);
  if (!cust) return { success: false };
  return { success: true, customer: cust };
}

function getPortalData(customerId) {
  const customers = getCustomers();
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return null;
  return {
    customer,
    pickup:   getPickups().find(p => p.customerId === customerId) || null,
    storage:  getStorageList().find(s => s.customerId === customerId) || null,
    items:    getItems(null, customerId),
    payments: getPayments(customerId),
  };
}

// ── STATS ────────────────────────────────────────────────────

function getStats() {
  const customers = getCustomers();
  const leads = getLeads();
  const pickups = getPickups();
  const storage = getStorageList();
  const items = getItems(null, null);
  const today = new Date().toISOString().split('T')[0];
  return {
    totalLeads: leads.length,
    totalCustomers: customers.length,
    activeItems: items.filter(i => i.status === 'In Storage').length,
    occupancy: Math.min(Math.round((storage.length / 50) * 100), 100),
    monthlyRevenue: '₹' + (storage.reduce((s, st) => s + st.monthlyRate, 0) / 1000).toFixed(1) + 'K',
    pendingPickups: pickups.filter(p => p.status === 'Scheduled').length,
    newLeadsToday: leads.filter(l => l.createdAt && l.createdAt.startsWith(today)).length,
  };
}
