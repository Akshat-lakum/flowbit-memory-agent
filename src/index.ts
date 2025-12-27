import { MemoryStore } from "./memory/store";
import { VendorMemoryManager } from "./memory/vendorMemory";
import { ResolutionMemoryManager } from "./memory/resolutionMemory";
import { recallVendorMemory } from "./engine/recall";
import { applyVendorMemory } from "./engine/apply";
import { learnFromHumanFeedback } from "./engine/learn";
import { isDuplicate } from "./engine/decide";
import { Invoice, HumanResolution } from "./types";

const store = new MemoryStore();
const vendorManager = new VendorMemoryManager(store);
const resolutionManager = new ResolutionMemoryManager(store);

// Simulated history
const processedInvoices: Invoice[] = [];

// Seed vendor memory
store.upsert({
  id: "vendor-supplier-service-date",
  type: "VendorMemory",
  vendor: "Supplier GmbH",
  pattern: "Leistungsdatum → serviceDate",
  data: "Map Leistungsdatum to serviceDate",
  confidence: 0.8,
  reinforcementCount: 4,
  lastUpdated: new Date().toISOString()
});

// -------- Invoice Run --------
const invoice: Invoice = {
  invoiceId: "INV-A-004",
  vendor: "Supplier GmbH",
  extractedFields: {
    Leistungsdatum: "2025-12-22"
  }
};

// Duplicate check
if (isDuplicate(invoice, processedInvoices)) {
  console.log("DUPLICATE INVOICE DETECTED — ESCALATING");
} else {
  const memories = recallVendorMemory(invoice, vendorManager);
  const decision = applyVendorMemory(invoice, memories, vendorManager);

  console.log("DECISION:", JSON.stringify(decision, null, 2));

  // Human resolution simulation
  const humanResolution: HumanResolution = "APPROVED";

  const updatedMemory = learnFromHumanFeedback(
    memories[0],
    humanResolution,
    decision.auditTrail
  );

  store.upsert(updatedMemory);
  resolutionManager.recordResolution(
    invoice.vendor,
    memories[0].pattern,
    humanResolution
  );

  processedInvoices.push(invoice);

  console.log("FINAL AUDIT:", decision.auditTrail);
}
