import { MemoryRecord } from "../memory/store";
import { HumanResolution, AuditEntry } from "../types";

export function learnFromHumanFeedback(
  memory: MemoryRecord,
  resolution: HumanResolution,
  auditTrail: AuditEntry[]
): MemoryRecord {
  let confidence = memory.confidence;
  let reinforcementCount = memory.reinforcementCount;

  if (resolution === "APPROVED") {
    confidence = Math.min(1, confidence + 0.05);
    reinforcementCount += 1;
    auditTrail.push({
      step: "learn",
      timestamp: new Date().toISOString(),
      details: `Memory approved → confidence increased to ${confidence.toFixed(2)}`
    });
  }

  if (resolution === "REJECTED") {
    confidence = Math.max(0, confidence - 0.1);
    auditTrail.push({
      step: "learn",
      timestamp: new Date().toISOString(),
      details: `Memory rejected → confidence decreased to ${confidence.toFixed(2)}`
    });
  }

  if (resolution === "CORRECTED") {
    confidence = Math.max(0, confidence - 0.05);
    auditTrail.push({
      step: "learn",
      timestamp: new Date().toISOString(),
      details: `Memory corrected → confidence adjusted to ${confidence.toFixed(2)}`
    });
  }

  return {
    ...memory,
    confidence,
    reinforcementCount,
    lastUpdated: new Date().toISOString()
  };
}
