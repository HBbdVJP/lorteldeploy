// ==================== Finance Schema Data ====================
// Child data file for Finance/Accounting data
// Source: src/data/masterdata.json (motherfile)
// Purpose: Organize masterdata by schema for easier imports

export { MasterData } from '../types/mastertype';

// Type shortcuts for Finance schema data
export type FinanceSchemaData = {
  AccountChart: any[];
  Bonus: any[];
  BonusRule: any[];
  DailyRevenue: any[];
  Deduction: any[];
  Expense: any[];
  FinancialTransaction: any[];
  GoodsReceipt: any[];
  GoodsReceiptItem: any[];
  Invoice: any[];
  InvoiceItem: any[];
  MaintenanceOrder: any[];
  Payment: any[];
  PaymentMethod: any[];
  PaymentOut: any[];
  PaymentOutAllocation: any[];
  PayPeriod: any[];
  PayrollItem: any[];
  PurchaseOrder: any[];
  PurchaseOrderItem: any[];
  ReportTemplate: any[];
  SalaryComponent: any[];
  Supplier: any[];
  TaxConfig: any[];
};
