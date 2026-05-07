// ==================== Customer Schema Data ====================
// Child data file for Customer/Booking data
// Source: src/data/masterdata.json (motherfile)
// Purpose: Organize masterdata by schema for easier imports

export type { MasterData } from '../types/mastertype';

// Type shortcuts for Customer schema data
export type CustomerSchemaData = {
  Booking: any[];
  BookingGuest: any[];
  BookingRoom: any[];
  BookingStatus: any[];
  CheckInOut: any[];
  Customer: any[];
  CustomerPreference: any[];
  Feedback: any[];
  LoyaltyProgram: any[];
  LoyaltyTier: any[];
  LoyaltyTransaction: any[];
};
