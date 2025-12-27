export type Invoice = {
    invoiceId: string;
    vendor: string;
    rawText?: string;
    extractedFields: Record<string, any>;
  };
  
  export type VendorDecision = {
    normalizedFields: Record<string, any>;
    proposedCorrections: string[];
    requiresHumanReview: boolean;
    reasoning: string;
    confidenceScore: number;
  };
  export type HumanResolution =
  | "APPROVED"
  | "REJECTED"
  | "CORRECTED";

export type AuditEntry = {
  step: "recall" | "apply" | "decide" | "learn";
  timestamp: string;
  details: string;
};
