import { MemoryStore, MemoryRecord } from "./store";

export class ResolutionMemoryManager {
  constructor(private store: MemoryStore) {}

  recordResolution(
    vendor: string,
    pattern: string,
    resolution: "APPROVED" | "REJECTED"
  ) {
    const id = `resolution:${vendor}:${pattern}`;

    const existing = this.store
      .getByType("ResolutionMemory")
      .find(m => m.id === id);

    const approvalDelta = resolution === "APPROVED" ? 1 : -1;

    const updated: MemoryRecord = {
      id,
      type: "ResolutionMemory",
      vendor,
      pattern,
      data: resolution,
      confidence: existing
        ? Math.max(0, existing.confidence + approvalDelta)
        : approvalDelta > 0 ? 1 : 0,
      reinforcementCount: existing
        ? existing.reinforcementCount + 1
        : 1,
      lastUpdated: new Date().toISOString()
    };

    this.store.upsert(updated);
  }

  shouldEscalate(vendor: string, pattern: string): boolean {
    const record = this.store
      .getByType("ResolutionMemory")
      .find(m => m.vendor === vendor && m.pattern === pattern);

    return record ? record.confidence < 0 : false;
  }
}
