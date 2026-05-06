// ==================== Marketing Schema Data ====================
// Child data file for Marketing/Campaign/Promotion data
// Source: src/data/masterdata.json (motherfile)
// Purpose: Organize masterdata by schema for easier imports

export { MasterData } from '../types/mastertype';

// Type shortcuts for Marketing schema data
export type MarketingSchemaData = {
  Campaign: any[];
  CampaignBudget: any[];
  CampaignChannel: any[];
  CampaignObjective: any[];
  CampaignPartner: any[];
  CampaignPerformance: any[];
  Coupon: any[];
  Event: any[];
  EventBooking: any[];
  EventService: any[];
  MarketingAsset: any[];
  MarketingPlan: any[];
  Partner: any[];
  Promotion: any[];
  PromotionRule: any[];
  PromotionUsage: any[];
};
