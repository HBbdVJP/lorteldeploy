// ==================== Auth Schema ====================
// Child schema file for Authentication entities
// Parent file: src/types/mastertype.ts

export interface SystemAccount {
  AccID: number;
  Email: string;
  Password: string; // plaintext for school project
  IsActive: boolean;
  LastLoginAt: string | null; // ISO datetime
  CreatedAt: string;
}
