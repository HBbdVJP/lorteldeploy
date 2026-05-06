// ==================== Customer Schema ====================
// Child schema file for Customer/Booking related entities
// Parent file: src/types/mastertype.ts

export interface Booking {
  BookingID: number;
  CustomerID: number;
  BranchID: number;
  BookingDate: string;
  CheckIn: string; // YYYY-MM-DD
  CheckOut: string;
  NumberOfAdults: number;
  NumberOfChildren: number;
  SpecialRequest: string | null;
  StatusID: number;
  Source: string | null;
}

export interface BookingGuest {
  BookingGuestID: number;
  BookingID: number;
  FullName: string;
  DateOfBirth: string | null;
  IDNumber: string | null;
  IsMainGuest: boolean;
}

export interface BookingRoom {
  BookingRoomID: number;
  BookingID: number;
  RoomID: number;
  RateApplied: number | null;
  GuestName: string | null;
  CheckIn: string | null;
  CheckOut: string | null;
}

export interface BookingStatus {
  StatusID: number;
  StatusName: string;
  Description: string | null;
}

export interface CheckInOut {
  CheckID: number;
  BookingRoomID: number;
  CheckInTime: string | null;
  CheckOutTime: string | null;
  ActualCheckOut: string | null;
}

export interface Customer {
  CustomerID: number;
  AccID: number | null;
  FirstName: string;
  LastName: string;
  Phone: string | null;
  Nationality: string | null;
  DateOfBirth: string | null;
  IDNumber: string | null;
  IDType: string | null;
  Address: string | null;
  CreatedAt: string;
}

export interface CustomerPreference {
  PrefID: number;
  CustomerID: number;
  PreferenceKey: string;
  PreferenceValue: string | null;
}

export interface Feedback {
  FeedbackID: number;
  BookingID: number;
  Rating: number | null;
  Comment: string | null;
  CreatedAt: string;
}

export interface LoyaltyProgram {
  LoyaltyID: number;
  CustomerID: number;
  PointsBalance: number;
  TierID: number;
}

export interface LoyaltyTier {
  TierID: number;
  TierName: string;
  MinPoints: number;
  DiscountPercent: number;
}

export interface LoyaltyTransaction {
  TransID: number;
  CustomerID: number;
  PointsEarned: number | null;
  PointsRedeemed: number | null;
  BookingID: number | null;
  Description: string | null;
  CreatedAt: string;
}
