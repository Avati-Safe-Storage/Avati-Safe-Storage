export type StorageType = "household" | "business" | "vehicle" | "documents";

export type StorageDuration = "1-3" | "3-6" | "6-12" | "12+";

export type QuotationFormData = {
  fullName: string;
  phone: string;
  email: string;
  storageType: StorageType;
  numberOfBoxes: number;
  estimatedVolume: number;
  storageDuration: StorageDuration;
  pickupRequired: boolean;
  insuranceRequired: boolean;
  pickupLocation: string;
  additionalNotes: string;
};

export type QuotationBreakdown = {
  quotationId: string;
  storageMonthly: number;
  volumeMonthly: number;
  durationDiscount: number;
  pickupCharges: number;
  insurance: number;
  subtotal: number;
  gst: number;
  totalMonthly: number;
  totalEstimate: number;
  validityDays: number;
  validUntil: string;
};

export type QuotationPayload = {
  customer: QuotationFormData;
  quote: QuotationBreakdown;
};
