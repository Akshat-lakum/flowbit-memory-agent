import { MemoryStore } from "../memory/store";
import { VendorMemoryManager } from "../memory/vendorMemory";
import { ResolutionMemoryManager } from "../memory/resolutionMemory";
import { recallVendorMemory } from "../engine/recall";
import { applyVendorMemory } from "../engine/apply";
import { learnFromHumanFeedback } from "../engine/learn";
import { finalizeOutput } from "../engine/finalize";
import { Invoice, HumanResolution } from "../types";

const store = new MemoryStore();
const vendorManager = new VendorMemoryManager(store);
const resolutionManager = new ResolutionMemoryManager(store);

// -------- INVOICE #1 --------
store.upsert({
  id: "vendor-supplier-service-date",
  type: "VendorMemory",
  vendor: "Supplier GmbH",
  pattern: "Leistungsdatum → serviceDate",
  data: "Map Leistungsdatum to serviceDate",
  confidence: 0.7,
  reinforcementCount: 1,
  lastUpdated: new Date().toISOString()
});

const invoice1: Invoice = {
  invoiceId: "INV-A-001",
  vendor: "Supplier GmbH",
  extractedFields: {
    Leistungsdatum: "2025-12-20"
  }
};

const memories1 = recallVendorMemory(invoice1, vendorManager);
const decision1 = applyVendorMemory(invoice1, memories1, vendorManager);

const resolution: HumanResolution = "APPROVED";
const updatedMemory = learnFromHumanFeedback(
  memories1[0],
  resolution,
  decision1.auditTrail
);

store.upsert(updatedMemory);
resolutionManager.recordResolution(
  invoice1.vendor,
  memories1[0].pattern,
  resolution
);

const output1 = finalizeOutput(decision1, [updatedMemory]);

console.log("\n--- INVOICE #1 OUTPUT ---");
console.log(JSON.stringify(output1, null, 2));

// -------- INVOICE #2 (LEARNED) --------
const invoice2: Invoice = {
  invoiceId: "INV-A-002",
  vendor: "Supplier GmbH",
  extractedFields: {
    Leistungsdatum: "2025-12-21"
  }
};

const memories2 = recallVendorMemory(invoice2, vendorManager);
const decision2 = applyVendorMemory(invoice2, memories2, vendorManager);

const output2 = finalizeOutput(decision2, []);

console.log("\n--- INVOICE #2 OUTPUT (AFTER LEARNING) ---");
console.log(JSON.stringify(output2, null, 2));
