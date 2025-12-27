import { Invoice } from "../types";
import { VendorMemoryManager } from "../memory/vendorMemory";
import { MemoryRecord } from "../memory/store";

export function recallVendorMemory(
  invoice: Invoice,
  manager: VendorMemoryManager
): MemoryRecord[] {
  const memories = manager.recall(invoice.vendor);

  const bestByPattern = new Map<string, MemoryRecord>();

  for (const memory of memories) {
    const existing = bestByPattern.get(memory.pattern);
    if (!existing || memory.confidence > existing.confidence) {
      bestByPattern.set(memory.pattern, memory);
    }
  }

  return Array.from(bestByPattern.values());
}
