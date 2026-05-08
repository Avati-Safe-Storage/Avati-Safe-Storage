import {
  assertValidQuotation,
  emailQuotation,
  generateQuotationPdf,
  parseQuotationPayload,
  sendApiError,
} from "./_quotation-service";
import { calculateQuotation } from "../src/lib/quotationPricing";

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    response.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const customer = parseQuotationPayload(request.body);
    assertValidQuotation(customer);
    const quote = calculateQuotation(customer);
    const payload = { customer, quote };
    const pdf = generateQuotationPdf(payload);
    const email = await emailQuotation(payload, pdf);

    response.status(200).json({ quotationId: quote.quotationId, email });
  } catch (error) {
    sendApiError(response, error);
  }
}
