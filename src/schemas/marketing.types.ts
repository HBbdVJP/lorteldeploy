// ==================== Marketing Schema ====================
// Child schema file for Marketing/Campaign/Promotion entities
// Parent file: src/types/mastertype.ts

export interface Campaign {
  CampaignID: number;
  PlanID: number | null;
  Name: string;
  StartDate: string;
  EndDate: string;
  Type: string;
  Description: string | null;
  Status: string;
  ManagerEmployeeID: number | null;
}

export interface CampaignBudget {
  BudgetID: number;
  CampaignID: number;
  BudgetItem: string;
  PlannedAmount: number;
  ActualAmount: number;
  Currency: string;
}

export interface CampaignChannel {
  ChannelID: number;
  CampaignID: number;
  ChannelType: string;
  AllocatedBudget: number;
  ActualSpend: number;
}

export interface CampaignObjective {
  ObjID: number;
  CampaignID: number;
  MetricName: string;
  TargetValue: number;
  Unit: string | null;
}

export interface CampaignPartner {
  CpgnPtnrPairID: number;
  EventID: number | null;
  PartnerID: number;
  Role: string | null;
  Contribution: string | null;
}

export interface CampaignPerformance {
  PerfID: number;
  CampaignID: number;
  ChannelID: number | null;
  Date: string;
  Metric: string;
  Value: number;
}

export interface Coupon {
  CouponID: number;
  Code: string;
  PromoID: number;
  IssuedTo: number | null;
  Status: string;
  ExpiryDate: string;
}

export interface Event {
  EventID: number;
  CampaignID: number | null;
  EventName: string;
  StartDate: string;
  EndDate: string;
  BranchID: number | null;
  Venue: string | null;
  Organizer: string | null;
  Status: string;
}

export interface EventBooking {
  BookID: number;
  EventID: number;
  CustomerID: number;
  BookingDate: string;
  NumberOfAttendees: number;
  SpecialRequest: string | null;
}

export interface EventService {
  ESID: number;
  EventBookingID: number;
  ServiceItemID: number;
  Quantity: number;
  Price: number;
}

export interface MarketingAsset {
  AssetID: number;
  CampaignID: number;
  AssetType: string;
  URL: string | null;
  Description: string | null;
}

export interface MarketingPlan {
  PlanID: number;
  Name: string;
  StartDate: string;
  EndDate: string;
  BranchID: number | null;
  BudgetTotal: number;
  Objective: string | null;
  Status: string;
}

export interface Partner {
  PartnerID: number;
  Name: string;
  Type: string;
  ContactInfo: string | null;
}

export interface Promotion {
  PromoID: number;
  CampaignID: number | null;
  PromoName: string;
  Description: string | null;
  DiscountType: string;
  Value: number;
  StartDate: string;
  EndDate: string;
}

export interface PromotionRule {
  RuleID: number;
  PromoID: number;
  RuleType: string;
  Value: string;
}

export interface PromotionUsage {
  UsageID: number;
  PromoID: number;
  BookingID: number;
  DiscountAmount: number;
  AppliedAt: string;
}
