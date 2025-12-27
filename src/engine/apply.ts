import { Invoice, VendorDecision, AuditEntry } from "../types";
import { MemoryRecord } from "../memory/store";
import { VendorMemoryManager } from "../memory/vendorMemory";

export function applyVendorMemory(
  invoice: Invoice,
  memories: MemoryRecord[],
  manager: VendorMemoryManager
): VendorDecision & { auditTrail: AuditEntry[] } {
  const normalizedFields = { ...invoice.extractedFields };
  const proposedCorrections: string[] = [];
  let requiresHumanReview = false;
  const reasoningParts: string[] = [];

  const auditTrail: AuditEntry[] = [];
  auditTrail.push({
    step: "apply",
    timestamp: new Date().toISOString(),
    details: `Applying vendor memory for ${invoice.vendor}`
  });

  let confidenceSum = 0;
  let appliedCount = 0;

  for (const memory of memories) {
    if (manager.shouldAutoApply(memory.confidence)) {
      reasoningParts.push(
        `Auto-applied vendor rule: ${memory.pattern} (confidence ${memory.confidence})`
      );
      confidenceSum += memory.confidence;
      appliedCount++;
    } else if (manager.shouldSuggest(memory.confidence)) {
      proposedCorrections.push(memory.pattern);
      reasoningParts.push(
        `Suggested vendor rule: ${memory.pattern} (confidence ${memory.confidence})`
      );
      requiresHumanReview = true;
    } else {
      reasoningParts.push(
        `Ignored low-confidence vendor rule: ${memory.pattern}`
      );
      requiresHumanReview = true;
    }
  }

  const confidenceScore =
    appliedCount > 0 ? confidenceSum / appliedCount : 0;

  return {
    normalizedFields,
    proposedCorrections,
    requiresHumanReview,
    reasoning: reasoningParts.join(" | "),
    confidenceScore,
    auditTrail
  };
}
