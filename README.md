# Memory-Driven Invoice Learning Agent

This project implements a **memory-driven learning layer** for invoice automation systems.  
Instead of treating every invoice independently, the system **learns from past human corrections and resolutions** and applies those learnings to future invoices in a **safe, explainable, and auditable** manner.
---
# Project Structure
src
 ├─ engine
 │   ├─ recall.ts        
 │   ├─ apply.ts         
 │   ├─ decide.ts        
 │   ├─ learn.ts         
 │   └─ finalize.ts      
 ├─ memory
 │   ├─ store.ts         
 │   ├─ vendorMemory.ts  
 │   └─ resolutionMemory.ts 
 ├─ demo
 │   └─ runDemo.ts       
 ├─ index.ts             
 └─ types.ts             

---

## Problem Context

Companies process hundreds of invoices daily. Many corrections repeat:
- Vendor-specific field naming (e.g. `Leistungsdatum`)
- Recurring tax or pricing behaviors
- Known resolution patterns

Traditional systems discard these corrections.  
This project introduces a **persistent memory layer** that improves automation rates over time.

---

## Core Design Principles

- **Memory is confidence-weighted**, not absolute truth
- **Human-in-the-loop learning** (no blind automation)
- **Explainability & auditability by default**
- **Bad or duplicate learnings never dominate**

No machine learning training is used — the system relies on **well-designed heuristics**.

---

## Memory Types Implemented

### 1. Vendor Memory
Stores vendor-specific patterns (e.g. field mappings, pricing behavior).

- Scoped per vendor
- Applied only when confidence thresholds are met
- Deduplicated by pattern (highest-confidence wins)

### 2. Resolution Memory
Tracks how patterns were historically resolved:
- Approved
- Rejected

Repeated rejections trigger escalation.

### 3. Audit Trail
Every decision and learning step is logged with:
- Step name
- Timestamp
- Human-readable explanation

---

## Decision Logic

| Confidence Range | Action |
|-----------------|--------|
| `< 0.4` | Escalate |
| `0.4 – 0.7` | Suggest correction |
| `>= 0.7` | Auto-apply |

Duplicate invoices are detected early and **never reinforce memory**.

---

## Learning Strategy

- **APPROVED** → small positive reinforcement
- **REJECTED** → stronger negative penalty
- **CORRECTED** → mild penalty
- Confidence is capped between `0.0 – 1.0`

This prevents runaway or incorrect learning.

---

## Output Contract

For each invoice, the system outputs:

```json
{
  "normalizedInvoice": {},
  "proposedCorrections": [],
  "requiresHumanReview": false,
  "reasoning": "",
  "confidenceScore": 0.0,
  "memoryUpdates": [],
  "auditTrail": []
}
