// ==================== Finance Schema ====================
// Child schema file for Finance/Accounting entities
// Parent file: src/types/mastertype.ts

export interface AccountChart {
  AccountID: number;
  AccountCode: string;
  AccountName: string;
  Type: string;
}

export interface Bonus {
  BonusID: number;
  PayrollID: number;
  BonusType: string;
  Amount: number;
  Reason: string | null;
  RefRuleID: number | null;
}

export interface BonusRule {
  RuleID: number;
  RuleName: string;
  Criteria: string | null;
  BonusAmount: number;
  AppliedScope: string | null;
}

export interface DailyRevenue {
  RevID: number;
  BranchID: number;
  Date: string;
  RoomRevenue: number;
  ServiceRevenue: number;
  Total: number;
}

export interface Deduction {
  DeductID: number;
  PayrollID: number;
  DeductionType: string;
  Amount: number;
  RefRuleID: number | null;
}

export interface Expense {
  ExpenseID: number;
  BranchID: number;
  ExpenseType: string;
  ReferenceID: number | null;
  Amount: number;
  TaxAmount: number;
  ExpenseDate: string;
  ApprovedBy: number | null;
}

export interface FinancialTransaction {
  TransID: number;
  AccountID: number;
  InvoiceID: number | null;
  PaymentID: number | null;
  Debit: number;
  Credit: number;
  TransDate: string;
}

export interface GoodsReceipt {
  ReceiptID: number;
  POID: number;
  ReceivedDate: string;
  ReceivedBy: number;
  Status: string;
  Notes: string | null;
}

export interface GoodsReceiptItem {
  ReceiptItemID: number;
  ReceiptID: number;
  POItemID: number;
  ItemID: number;
  QuantityReceived: number;
  UnitCost: number;
  ExpiryDate: string | null;
}

export interface Invoice {
  InvoiceID: number;
  BookingID: number | null;
  CustomerID: number;
  InvoiceDate: string;
  TotalBeforeTax: number;
  TaxAmount: number;
  Total: number;
  Status: string;
}

export interface InvoiceItem {
  LineID: number;
  InvoiceID: number;
  ItemType: string;
  ReferenceID: number | null;
  Description: string | null;
  Quantity: number;
  UnitPrice: number;
  SubTotal: number;
}

export interface MaintenanceOrder {
  MOID: number;
  RequestID: number | null;
  SupplierID: number | null;
  InternalEmployeeID: number | null;
  PlannedCost: number;
  ActualCost: number | null;
  Status: string;
  PaymentDueDate: string | null;
}

export interface Payment {
  PaymentID: number;
  InvoiceID: number;
  PaymentMethodID: number;
  Amount: number;
  PaidAt: string;
  TransactionRef: string | null;
}

export interface PaymentMethod {
  MethodID: number;
  MethodName: string;
}

export interface PaymentOut {
  PaymentOutID: number;
  SupplierID: number | null;
  Payee: string | null;
  PaymentMethodID: number;
  Amount: number;
  PaidAt: string;
  TransactionRef: string | null;
  CreatedBy: number;
}

export interface PaymentOutAllocation {
  AllocID: number;
  PaymentOutID: number;
  ReferenceType: string;
  ReferenceID: number;
  AllocatedAmount: number;
}

export interface PayPeriod {
  PeriodID: number;
  StartDate: string;
  EndDate: string;
  BranchID: number;
  Status: string;
}

export interface PayrollItem {
  PayrollID: number;
  PeriodID: number;
  EmployeeID: number;
  TotalEarnings: number;
  TotalDeductions: number;
  NetPay: number;
  CalculatedAt: string;
}

export interface PurchaseOrder {
  POID: number;
  SupplierID: number;
  BranchID: number;
  CreatedByEmployeeID: number;
  OrderDate: string;
  Status: string;
  TotalAmount: number;
  ApprovedBy: number | null;
}

export interface PurchaseOrderItem {
  POItemID: number;
  POID: number;
  ItemType: string;
  ReferenceID: number | null;
  Description: string | null;
  Quantity: number;
  UnitPrice: number;
  SubTotal: number;
}

export interface ReportTemplate {
  TemplateID: number;
  Name: string;
  QuerySQL: string | null;
  CreatedBy: number | null;
}

export interface SalaryComponent {
  CompID: number;
  PayrollID: number;
  ComponentType: string;
  Amount: number;
}

export interface Supplier {
  SupplierID: number;
  SupplierName: string;
  ContactPerson: string | null;
  Phone: string | null;
  Email: string | null;
  Address: string | null;
  TaxCode: string | null;
}

export interface TaxConfig {
  TaxID: number;
  TaxName: string;
  Rate: number;
  EffectiveDate: string;
  EndDate: string | null;
}
