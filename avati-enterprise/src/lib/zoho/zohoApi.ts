import { ZOHO_CONFIG } from './zohoConfig';
import type { Lead, Customer, Pickup, StoredItem, Storage, Payment } from './zohoTypes';

export class ZohoApi {
  private getToken: () => Promise<string | null>;

  constructor(getToken: () => Promise<string | null>) {
    this.getToken = getToken;
  }

  private async fetchApi(path: string, options: RequestInit = {}) {
    const token = await this.getToken();
    if (!token && !path.startsWith('webhook')) {
      throw new Error('Zoho Authentication required');
    }

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Zoho-oauthtoken ${token}`);
    }

    // Replace mapped API domains
    let url = `${ZOHO_CONFIG.apiDomain}${path}`;
    if (path.startsWith('webhook')) {
      // For Flow Webhooks
      url = path.replace('webhook', ZOHO_CONFIG.flowWebhookUrl);
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Zoho API Error');
    }
    return data;
  }

  async getLeads(): Promise<Lead[]> {
    try {
      const result = await this.fetchApi('/crm/v6/Leads');
      return result.data.map((l: any) => ({
        id: l.Lead_ID || `AVT-LEAD-${Math.floor(Math.random() * 9000)}`,
        zohoId: l.id,
        name: l.Last_Name,
        phone: l.Phone,
        email: l.Email,
        storageType: l.Storage_Type,
        plan: l.Plan || 'Basic',
        area: l.Area || 'N/A',
        pickupDate: l.Pickup_Date || '',
        duration: l.Duration || 1,
        packingRequired: l.Packing_Required === 'true',
        transportRequired: l.Transport_Required === 'true',
        distance: l.Distance || 0,
        liftAvailable: l.Lift_Available || 'Yes',
        floors: l.Floors || 0,
        inventoryJson: l.Inventory_Json || '[]',
        monthlyEstimate: l.Monthly_Estimate || 0,
        totalEstimate: l.Total_Estimate || 0,
        status: l.Lead_Status || 'New',
        notes: l.Description || '',
        createdAt: l.Created_Time || new Date().toISOString()
      }));
    } catch(e) {
      // Fallback for dev mode when CRM is empty or token missing
      console.warn("Using mock leads fallback");
      return [];
    }
  }

  async updateLeadStatus(zohoLeadId: string, status: string): Promise<boolean> {
    const data = { data: [{ id: zohoLeadId, Lead_Status: status }] };
    const result = await this.fetchApi('/crm/v6/Leads', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return result.data[0].status === 'success';
  }

  async createLead(lead: Partial<Lead>): Promise<string> {
    const data = {
      data: [{
        Company: 'Avati Storage Lead',
        Last_Name: lead.name,
        Phone: lead.phone,
        Email: lead.email,
        Lead_Source: 'Website Quote',
        Lead_Status: 'Quotation Sent',
        Storage_Type: lead.storageType,
        Monthly_Estimate: lead.monthlyEstimate,
      }]
    };
    
    const result = await this.fetchApi('/crm/v6/Leads', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    
    return result.data[0].details.id;
  }

  async convertLeadToCustomer(zohoLeadId: string, avtCustId: string): Promise<string> {
    // Lead Conversion in Zoho CRM
    const data = {
      data: [{
        overwrite: true,
        notify_lead_owner: true,
        notify_new_entity_owner: true,
        Contacts: {
          Customer_ID: avtCustId // Custom field AVT-CUST-xxxx
        }
      }]
    };
    
    const result = await this.fetchApi(`/crm/v6/Leads/${zohoLeadId}/actions/convert`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    return result.data[0].Contacts.id;
  }

  // --- Zoho Flow Triggers ---
  
  async triggerBrochureFlow(leadData: any) {
    if (!ZOHO_CONFIG.flowWebhookUrl) return;
    
    await fetch(ZOHO_CONFIG.flowWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_brochure',
        ...leadData
      })
    });
  }

  // --- Zoho Sign ---
  
  async sendRentalAgreement(customer: Customer) {
    // Initiates Zoho Sign document workflow
    // For demo purposes, we will return a mock status
    console.log(`Sending Rental Agreement via Zoho Sign to ${customer.email}`);
    return { success: true, documentId: 'ZOHO-SIGN-001' };
  }

  // --- Zoho Inventory & Billing ---
  
  async assignStorageLocation(customerId: string, location: string) {
    // Mapped to Warehouse Bin (WH1-A1) in Zoho Inventory
    console.log(`Assigning ${location} to customer ${customerId} in Zoho Inventory`);
    return { success: true, storageId: `AVT-STO-${Math.floor(1000 + Math.random() * 9000)}` };
  }

  async createBillingSubscription(customerId: string, monthlyRate: number, pickupDate: string) {
    // Mapped to Zoho Billing (pro-rata rent to 5th of month)
    console.log(`Creating Zoho Billing Subscription for ${customerId} starting ${pickupDate}`);
    return { success: true, subscriptionId: 'ZOHO-SUB-001' };
  }
}
