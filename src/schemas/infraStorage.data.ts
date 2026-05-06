// ==================== InfraStorage Schema Data ====================
// Child data file for Infrastructure/Storage/Room data
// Source: src/data/masterdata.json (motherfile)
// Purpose: Organize masterdata by schema for easier imports

export { MasterData } from '../types/mastertype';

// Type shortcuts for InfraStorage schema data
export type InfraStorageSchemaData = {
  Amenity: any[];
  AssetInventory: any[];
  Branch: any[];
  Building: any[];
  Facility: any[];
  FacilityStatusLog: any[];
  Floor: any[];
  MaintenanceRequest: any[];
  MaintenanceSchedule: any[];
  Room: any[];
  RoomAmenity: any[];
  RoomStatus: any[];
  RoomStatusHistory: any[];
  RoomType: any[];
  ServiceCategory: any[];
  ServiceInventory: any[];
  ServiceItem: any[];
  ServiceOrder: any[];
  ServiceOrderDetail: any[];
  ServicePrice: any[];
  ServiceUsageLog: any[];
  UtilityMeter: any[];
  UtilityReading: any[];
};
