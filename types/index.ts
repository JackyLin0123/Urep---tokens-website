// ─────────────────────────────────────────────────
// EcoToken — Shared Types
// ─────────────────────────────────────────────────

export type ItemType =
  | "PLASTIC_BOTTLE"
  | "ALUMINUM_CAN"
  | "GLASS_BOTTLE"
  | "PAPER"
  | "CARDBOARD"
  | "ELECTRONICS"
  | "TEXTILE"
  | "COMPOST"
  | "OTHER";

export type RewardCategory =
  | "SERVICE_HOURS"
  | "FOOD_VOUCHER"
  | "MERCHANDISE"
  | "EXPERIENCE";

export type RedemptionStatus =
  | "PENDING"
  | "FULFILLED"
  | "EXPIRED"
  | "CANCELLED";

// ── UI-friendly item type config ────────────────

export const ITEM_CONFIG: Record<
  ItemType,
  { label: string; emoji: string; tokens: number }
> = {
  PLASTIC_BOTTLE: { label: "Plastic Bottle", emoji: "🧴", tokens: 5 },
  ALUMINUM_CAN:   { label: "Aluminum Can",   emoji: "🥫", tokens: 5 },
  GLASS_BOTTLE:   { label: "Glass Bottle",   emoji: "🍾", tokens: 7 },
  PAPER:          { label: "Paper",           emoji: "📄", tokens: 3 },
  CARDBOARD:      { label: "Cardboard",       emoji: "📦", tokens: 4 },
  ELECTRONICS:    { label: "Electronics",     emoji: "📱", tokens: 15 },
  TEXTILE:        { label: "Textile",         emoji: "👕", tokens: 10 },
  COMPOST:        { label: "Compost",         emoji: "🌱", tokens: 3 },
  OTHER:          { label: "Other",           emoji: "♻️", tokens: 2 },
};

export const CATEGORY_CONFIG: Record<
  RewardCategory,
  { label: string; emoji: string; color: string }
> = {
  SERVICE_HOURS: { label: "Service Hours",  emoji: "🎓", color: "bg-blue-100 text-blue-800" },
  FOOD_VOUCHER:  { label: "Food & Drink",   emoji: "☕", color: "bg-amber-100 text-amber-800" },
  MERCHANDISE:   { label: "Merchandise",    emoji: "🎁", color: "bg-purple-100 text-purple-800" },
  EXPERIENCE:    { label: "Experience",     emoji: "🌿", color: "bg-eco-100 text-eco-800" },
};

// ── API response types ──────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  university: string | null;
  tokenBalance: number;
  totalRecycled: number;
  currentStreak: number;
  longestStreak: number;
  lastRecycledAt: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface RecyclingEntry {
  id: string;
  itemType: ItemType;
  quantity: number;
  tokensEarned: number;
  binLocation: string | null;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  category: RewardCategory;
  tokenCost: number;
  imageUrl: string | null;
  stock: number | null;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  tokensCost: number;
  status: RedemptionStatus;
  code: string | null;
  createdAt: string;
  reward: RewardItem;
}

export interface LeaderboardEntry {
  id: string;
  name: string | null;
  email: string;
  totalRecycled: number;
  tokenBalance: number;
  currentStreak: number;
}
