import { VendorDecision, AuditEntry } from "../types";
import { MemoryRecord } from "../memory/store";

export function finalizeOutput(
  decision: VendorDecision & { auditTrail: AuditEntry[] },
  updatedMemories: MemoryRecord[]
) {
  return {
    normalizedInvoice: decision.normalizedFields,
    proposedCorrections: decision.proposedCorrections,
    requiresHumanReview: decision.requiresHumanReview,
    reasoning: decision.reasoning,
    confidenceScore: decision.confidenceScore,
    memoryUpdates: updatedMemories.map(
      m => `${m.type} updated: ${m.pattern} → confidence ${m.confidence}`
    ),
    auditTrail: decision.auditTrail
  };
}
