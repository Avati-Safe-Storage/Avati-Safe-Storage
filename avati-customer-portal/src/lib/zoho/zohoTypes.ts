export interface Lead {
  id: string; // AVT-LEAD-xxxx
  zohoId?: string; // CRM internal ID
  name: string;
  phone: string;
  email: string;
  storageType: string;
  plan: string;
  area: string;
  pickupDate: string;
  duration: number;
  packingRequired: boolean;
  transportRequired: boolean;
  distance: number;
  liftAvailable: string;
  floors: number;
  inventoryJson: string;
  monthlyEstimate: number;
  totalEstimate: number;
  status: 'New' | 'Contacted' | 'Quotation Sent' | 'Booking Confirmed' | 'Converted' | 'Lost';
  notes?: string;
  createdAt: string;
  convertedCustomerId?: string;
}

export interface Customer {
  id: string; // AVT-CUST-xxxx
  zohoId?: string; // CRM Contact internal ID
  leadId?: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  // Encrypted in Zoho CRM but managed via the orchestrator:
  kycType?: string;
  kycId?: string;
  gstin?: string;
  createdAt: string;
}

export interface Pickup {
  id: string; // AVT-PKP-xxxx
  customerId: string;
  address: string;
  pickupDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface StoredItem {
  id: string; // AVT-ITM-xxxx
  customerId: string;
  name: string;
  category: string;
  quantity: number;
  condition: string;
}

export interface Storage {
  id: string; // AVT-STO-xxxx
  customerId: string;
  location: string; // e.g. WH1-A1
  plan: string;
  itemCount: number;
  monthlyRate: number;
  status: 'Active' | 'Closed';
}

export interface Payment {
  id: string; // AVT-PAY-xxxx
  customerId: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue';
}
