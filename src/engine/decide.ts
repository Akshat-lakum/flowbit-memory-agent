import { Invoice } from "../types";

export function isDuplicate(
  current: Invoice,
  previous: Invoice[]
): boolean {
  return previous.some(inv =>
    inv.vendor === current.vendor &&
    inv.invoiceId === current.invoiceId
  );
}
