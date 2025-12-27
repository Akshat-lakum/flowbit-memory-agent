import Database from "better-sqlite3";

export type MemoryRecord = {
  id: string;
  type: "VendorMemory" | "CorrectionMemory" | "ResolutionMemory";
  vendor: string | null;
  pattern: string;
  data: string;
  confidence: number;
  reinforcementCount: number;
  lastUpdated: string;
};

export class MemoryStore {
  private db: Database.Database;

  constructor() {
    this.db = new Database("memory.db");
    this.initialize();
  }

  private initialize() {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS memory (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        vendor TEXT,
        pattern TEXT NOT NULL,
        data TEXT NOT NULL,
        confidence REAL NOT NULL,
        reinforcementCount INTEGER NOT NULL,
        lastUpdated TEXT NOT NULL
      )
    `).run();
  }

  getByVendor(vendor: string): MemoryRecord[] {
    return this.db
      .prepare(`SELECT * FROM memory WHERE vendor = ?`)
      .all(vendor) as MemoryRecord[];
  }

  getByType(type: MemoryRecord["type"]): MemoryRecord[] {
    return this.db
      .prepare(`SELECT * FROM memory WHERE type = ?`)
      .all(type) as MemoryRecord[];
  }

  upsert(record: MemoryRecord) {
    this.db.prepare(`
      INSERT INTO memory (
        id, type, vendor, pattern, data,
        confidence, reinforcementCount, lastUpdated
      ) VALUES (
        @id, @type, @vendor, @pattern, @data,
        @confidence, @reinforcementCount, @lastUpdated
      )
      ON CONFLICT(id) DO UPDATE SET
        confidence = excluded.confidence,
        reinforcementCount = excluded.reinforcementCount,
        lastUpdated = excluded.lastUpdated
    `).run(record);
  }
}
