import { MemoryStore, MemoryRecord } from "./store";

export class VendorMemoryManager {
  constructor(private store: MemoryStore) {}

  /**
   * Fetch all vendor-specific memories
   */
  recall(vendor: string): MemoryRecord[] {
    return this.store
      .getByVendor(vendor)
      .filter(m => m.type === "VendorMemory");
  }

  /**
   * High-confidence memory → safe to auto-apply
   */
  shouldAutoApply(confidence: number): boolean {
    return confidence >= 0.7;
  }

  /**
   * Medium-confidence memory → suggest only
   */
  shouldSuggest(confidence: number): boolean {
    return confidence >= 0.4 && confidence < 0.7;
  }
}
