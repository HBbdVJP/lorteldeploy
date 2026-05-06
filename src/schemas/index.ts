// ==================== Schemas Index ====================
// Central export point for all 6 schema child files
// Parent file: src/types/mastertype.ts (motherfile - DO NOT DELETE)
// 
// IMPORTANT: The motherfile (mastertype.ts) contains the complete MasterData interface
// and all type definitions. These schema files are children that organize the types
// by schema domain for easier imports and maintainability.
//
// Usage:
// - Import specific schema types: import { Room, RoomType } from '@/schemas/infraStorage.types';
// - Import schema data types: import type { InfraStorageSchemaData } from '@/schemas/infraStorage.data';
// - Import all from motherfile: import { MasterData } from '@/types/mastertype';

// Auth Schema
export * from './auth.types';
export * from './auth.data';

// Customer Schema
export * from './customer.types';
export * from './customer.data';

// Finance Schema
export * from './finance.types';
export * from './finance.data';

// InfraStorage Schema
export * from './infraStorage.types';
export * from './infraStorage.data';

// Marketing Schema
export * from './marketing.types';
export * from './marketing.data';

// Staff Schema
export * from './staff.types';
export * from './staff.data';
