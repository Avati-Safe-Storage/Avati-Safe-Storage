"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BadgeIndianRupee,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { calculateQuotation, formatCurrency, validateQuotation } from "@/lib/quotationPricing";
import type { QuotationFormData, StorageDuration, StorageType } from "@/lib/quotationTypes";

const initialForm: QuotationFormData = {
  fullName: "",
  phone: "",
  email: "",
  storageType: "household",
  numberOfBoxes: 10,
  estimatedVolume: 120,
  storageDuration: "3-6",
  pickupRequired: true,
  insuranceRequired: true,
  pickupLocation: "",
  additionalNotes: "",
};

const storageTypes: { value: StorageType; label: string }[] = [
  { value: "household", label: "Household Storage" },
  { value: "business", label: "Business Inventory" },
  { value: "vehicle", label: "Vehicle Storage" },
  { value: "documents", label: "Documents & Records" },
];

const durations: { value: StorageDuration; label: string }[] = [
  { value: "1-3", label: "1 to 3 months" },
  { value: "3-6", label: "3 to 6 months" },
  { value: "6-12", label: "6 to 12 months" },
  { value: "12+", label: "12+ months" },
];

type FieldErrors = Partial<Record<keyof QuotationFormData, string>>;

function FieldMessage({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-sm text-red-600">{children}</p>;
}

export function QuotationSystem() {
  const [form, setForm] = useState<QuotationFormData>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const quote = useMemo(() => calculateQuotation(form), [form]);

  const updateForm = <Key extends keyof QuotationFormData>(key: Key, value: QuotationFormData[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateQuotation(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitMessage("Please review the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/quotation-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Unable to generate quotation.");
      }

      setSubmitMessage(`Quotation ${result.quotationId} generated and emailed successfully.`);
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "Unable to generate quotation right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quote" className="py-24 bg-gradient-to-br from-[#0B1F3A] to-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-white mb-4">Get Instant Quote</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Share a few storage details and receive a branded Avati quotation by email.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-10"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-2xl text-black">Quotation Details</h3>
                <p className="text-gray-600 mt-1">All pricing updates live as you edit the request.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(event) => updateForm("fullName", event.target.value)}
                  className="mt-2 h-12 rounded-lg border-2 border-gray-200 focus-visible:border-[#D4AF37]"
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.fullName)}
                />
                <FieldMessage>{errors.fullName}</FieldMessage>
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  className="mt-2 h-12 rounded-lg border-2 border-gray-200 focus-visible:border-[#D4AF37]"
                  placeholder="9876543210"
                  aria-invalid={Boolean(errors.phone)}
                />
                <FieldMessage>{errors.phone}</FieldMessage>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  className="mt-2 h-12 rounded-lg border-2 border-gray-200 focus-visible:border-[#D4AF37]"
                  placeholder="name@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
                <FieldMessage>{errors.email}</FieldMessage>
              </div>

              <div>
                <Label className="text-gray-700">Storage Type</Label>
                <Select value={form.storageType} onValueChange={(value) => updateForm("storageType", value as StorageType)}>
                  <SelectTrigger className="mt-2 h-12 rounded-lg border-2 border-gray-200 focus:border-[#D4AF37]">
                    <SelectValue placeholder="Select storage type" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldMessage>{errors.storageType}</FieldMessage>
              </div>

              <div>
                <Label htmlFor="numberOfBoxes" className="text-gray-700">Number of Boxes</Label>
                <Input
                  id="numberOfBoxes"
                  type="number"
                  min="0"
                  value={form.numberOfBoxes}
                  onChange={(event) => updateForm("numberOfBoxes", Number(event.target.value))}
                  className="mt-2 h-12 rounded-lg border-2 border-gray-200 focus-visible:border-[#D4AF37]"
                  aria-invalid={Boolean(errors.numberOfBoxes)}
                />
                <FieldMessage>{errors.numberOfBoxes}</FieldMessage>
              </div>

              <div>
                <Label htmlFor="estimatedVolume" className="text-gray-700">Estimated Volume</Label>
                <div className="relative mt-2">
                  <Input
                    id="estimatedVolume"
                    type="number"
                    min="1"
                    value={form.estimatedVolume}
                    onChange={(event) => updateForm("estimatedVolume", Number(event.target.value))}
                    className="h-12 rounded-lg border-2 border-gray-200 pr-16 focus-visible:border-[#D4AF37]"
                    aria-invalid={Boolean(errors.estimatedVolume)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">cu ft</span>
                </div>
                <FieldMessage>{errors.estimatedVolume}</FieldMessage>
              </div>

              <div>
                <Label className="text-gray-700">Storage Duration</Label>
                <Select value={form.storageDuration} onValueChange={(value) => updateForm("storageDuration", value as StorageDuration)}>
                  <SelectTrigger className="mt-2 h-12 rounded-lg border-2 border-gray-200 focus:border-[#D4AF37]">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>{duration.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldMessage>{errors.storageDuration}</FieldMessage>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border-2 border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="pickupRequired" className="text-gray-700">Pickup Required</Label>
                    <Switch
                      id="pickupRequired"
                      checked={form.pickupRequired}
                      onCheckedChange={(checked) => updateForm("pickupRequired", checked)}
                      className="data-[state=checked]:bg-[#D4AF37]"
                    />
                  </div>
                </div>
                <div className="rounded-xl border-2 border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="insuranceRequired" className="text-gray-700">Insurance</Label>
                    <Switch
                      id="insuranceRequired"
                      checked={form.insuranceRequired}
                      onCheckedChange={(checked) => updateForm("insuranceRequired", checked)}
                      className="data-[state=checked]:bg-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="pickupLocation" className="text-gray-700">Pickup Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    id="pickupLocation"
                    value={form.pickupLocation}
                    onChange={(event) => updateForm("pickupLocation", event.target.value)}
                    className="h-12 rounded-lg border-2 border-gray-200 pl-12 focus-visible:border-[#D4AF37]"
                    placeholder="Area, city, landmark"
                    aria-invalid={Boolean(errors.pickupLocation)}
                  />
                </div>
                <FieldMessage>{errors.pickupLocation}</FieldMessage>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="additionalNotes" className="text-gray-700">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={form.additionalNotes}
                  onChange={(event) => updateForm("additionalNotes", event.target.value)}
                  className="mt-2 min-h-28 rounded-lg border-2 border-gray-200 focus-visible:border-[#D4AF37]"
                  placeholder="Fragile items, access timing, floor details, or special handling needs"
                />
              </div>
            </div>

            {submitMessage && (
              <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                {submitMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full h-12 rounded-lg bg-[#D4AF37] text-black hover:bg-[#c9a332] hover:shadow-lg"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
              {isSubmitting ? "Generating Quote" : "Generate & Email Quotation"}
            </Button>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-[#0B1F3A] to-black text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-300">Live Quote Summary</p>
                    <h3 className="text-3xl text-white mt-1">{formatCurrency(quote.totalEstimate)}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center">
                    <BadgeIndianRupee className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-gray-300">Monthly</p>
                    <p className="text-lg text-[#D4AF37]">{formatCurrency(quote.totalMonthly)}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-gray-300">Valid Until</p>
                    <p className="text-lg text-[#D4AF37]">
                      {new Date(quote.validUntil).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {[
                  ["Storage pricing", quote.storageMonthly],
                  ["Volume pricing", quote.volumeMonthly],
                  ["Duration discount", -quote.durationDiscount],
                  ["Pickup charges", quote.pickupCharges],
                  ["Insurance", quote.insurance],
                  ["GST (18%)", quote.gst],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 text-gray-700">
                    <span>{label}</span>
                    <span className={Number(value) < 0 ? "text-green-700" : "text-black"}>
                      {Number(value) < 0 ? "-" : ""}{formatCurrency(Math.abs(Number(value)))}
                    </span>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-lg text-black">Total Estimate</span>
                  <span className="text-2xl text-[#D4AF37]">{formatCurrency(quote.totalEstimate)}</span>
                </div>

                <div className="grid gap-3 pt-2">
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <Package className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                    <p className="text-sm text-gray-600">Storage, pickup, insurance, and GST are itemized for transparent approval.</p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                    <p className="text-sm text-gray-600">Final billing may vary after item inspection and confirmed service scope.</p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-[#D4AF37]/10 p-4">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                    <p className="text-sm text-gray-700">PDF quotation is generated with Avati branding and emailed to customer plus admin.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
