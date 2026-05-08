import type { QuotationBreakdown, QuotationFormData, StorageDuration, StorageType } from "./quotationTypes";

export const GST_RATE = 0.18;

const STORAGE_BASE_RATES: Record<StorageType, number> = {
  household: 1800,
  business: 2400,
  vehicle: 3200,
  documents: 1200,
};

const VOLUME_RATE_PER_CFT: Record<StorageType, number> = {
  household: 18,
  business: 22,
  vehicle: 14,
  documents: 12,
};

const DURATION_MULTIPLIER: Record<StorageDuration, number> = {
  "1-3": 1,
  "3-6": 0.95,
  "6-12": 0.9,
  "12+": 0.85,
};

const DURATION_MONTHS: Record<StorageDuration, number> = {
  "1-3": 3,
  "3-6": 6,
  "6-12": 12,
  "12+": 12,
};

const PICKUP_BASE = 1500;
const PICKUP_PER_BOX = 60;
const INSURANCE_RATE = 0.025;
const VALIDITY_DAYS = 7;

export function createQuotationId(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();

  return `AVT-${stamp}-${suffix}`;
}

export function calculateQuotation(input: QuotationFormData, quotationId = createQuotationId()): QuotationBreakdown {
  const boxes = Math.max(0, Number(input.numberOfBoxes) || 0);
  const volume = Math.max(0, Number(input.estimatedVolume) || 0);
  const storageType = input.storageType || "household";
  const duration = input.storageDuration || "1-3";

  const storageMonthly = STORAGE_BASE_RATES[storageType] + boxes * 85;
  const volumeMonthly = volume * VOLUME_RATE_PER_CFT[storageType];
  const grossMonthly = storageMonthly + volumeMonthly;
  const discountedMonthly = Math.round(grossMonthly * DURATION_MULTIPLIER[duration]);
  const durationDiscount = Math.max(0, grossMonthly - discountedMonthly);
  const pickupCharges = input.pickupRequired ? PICKUP_BASE + boxes * PICKUP_PER_BOX : 0;
  const insurance = input.insuranceRequired ? Math.round(discountedMonthly * INSURANCE_RATE) : 0;
  const subtotal = discountedMonthly + pickupCharges + insurance;
  const gst = Math.round(subtotal * GST_RATE);
  const totalMonthly = Math.round(discountedMonthly + insurance + (discountedMonthly + insurance) * GST_RATE);
  const totalEstimate = subtotal + gst;
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + VALIDITY_DAYS);

  return {
    quotationId,
    storageMonthly,
    volumeMonthly,
    durationDiscount,
    pickupCharges,
    insurance,
    subtotal,
    gst,
    totalMonthly,
    totalEstimate,
    validityDays: VALIDITY_DAYS,
    validUntil: validUntilDate.toISOString(),
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));
}

export function getDurationMonths(duration: StorageDuration) {
  return DURATION_MONTHS[duration];
}

export function validateQuotation(input: QuotationFormData) {
  const errors: Partial<Record<keyof QuotationFormData, string>> = {};

  if (!input.fullName.trim()) errors.fullName = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(input.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid 10-digit mobile number.";
  if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Enter a valid email address.";
  if (!input.storageType) errors.storageType = "Select a storage type.";
  if (input.numberOfBoxes < 0) errors.numberOfBoxes = "Boxes cannot be negative.";
  if (input.estimatedVolume <= 0) errors.estimatedVolume = "Estimated volume must be greater than zero.";
  if (!input.storageDuration) errors.storageDuration = "Select a storage duration.";
  if (input.pickupRequired && !input.pickupLocation.trim()) {
    errors.pickupLocation = "Pickup location is required when pickup is selected.";
  }

  return errors;
}
