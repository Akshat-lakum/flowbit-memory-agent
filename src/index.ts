console.log("APPLICATION BOOTSTRAPPED");

import { MemoryStore } from "./memory/store";

const store = new MemoryStore();

store.upsert({
  id: "boot-test",
  type: "VendorMemory",
  vendor: "Supplier GmbH",
  pattern: "Leistungsdatum → serviceDate",
  data: "Map Leistungsdatum to serviceDate",
  confidence: 0.6,
  reinforcementCount: 1,
  lastUpdated: new Date().toISOString()
});

console.log("MEMORY:", store.getByVendor("Supplier GmbH"));
