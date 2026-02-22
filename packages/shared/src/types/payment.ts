// Phase 6: Payment & Monetization types

// ─── Product ──────────────────────────────────────────────────────────────

export type ProductType =
  | "paper"
  | "paper_set"
  | "test"
  | "course"
  | "bundle"
  | "add_on_service";

export type ProductStatus = "active" | "inactive" | "draft";

export interface ProductPricing {
  currency: string;
  basePrice: number;
  discountPrice: number | null;
  discountValidUntil: string | null;
  isFree: boolean;
}

export interface ProductAddOn {
  type: string;
  title: string;
  description: string;
  price: number;
}

export interface BundleItem {
  productId: string;
  referenceType: string;
  referenceId: string;
  title: string;
}

export interface Product {
  _id: string;
  companyId: string;
  type: ProductType;
  referenceId: string | null;
  title: string;
  description: string;
  thumbnail: string;
  pricing: ProductPricing;
  addOns: ProductAddOn[];
  bundleItems: BundleItem[];
  tags: string[];
  category: string;
  yearGroup: string;
  subject: string;
  totalPurchases: number;
  status: ProductStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Purchase ─────────────────────────────────────────────────────────────

export type PurchaseStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "expired";

export interface PurchaseAddOn {
  type: string;
  title: string;
  price: number;
}

export interface Purchase {
  _id: string;
  buyerUserId: string;
  buyerRole: "student" | "parent";
  studentUserId: string;
  productId: string;
  productType: string;
  productTitle: string;
  amount: number;
  currency: string;
  addOns: PurchaseAddOn[];
  status: PurchaseStatus;
  accessGranted: boolean;
  accessGrantedAt: string | null;
  completedAt: string | null;
  receiptUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Access Check ─────────────────────────────────────────────────────────

export interface AccessCheckResult {
  hasAccess: boolean;
  product?: Product;
  purchase?: Purchase;
}

// ─── Revenue ──────────────────────────────────────────────────────────────

export interface RevenueOverview {
  totalRevenue: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  monthOverMonthGrowth: number;
  totalTransactions: number;
  averageOrderValue: number;
}

export interface RevenueTimeSeries {
  date: string;
  revenue: number;
  count: number;
}

export interface RevenueByProduct {
  type: string;
  revenue: number;
  count: number;
}

export interface RevenueByCategory {
  category: string;
  revenue: number;
  count: number;
}

export interface TopProduct {
  product: {
    _id: string;
    title: string;
    type: string;
    status: string;
    thumbnail: string;
  };
  purchaseCount: number;
  totalRevenue: number;
}

// ─── Stripe Connect ───────────────────────────────────────────────────────

export interface StripeAccountStatus {
  status: string;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  onboardingComplete: boolean;
}

export interface StripeBalance {
  available: Array<{ amount: number; currency: string }>;
  pending: Array<{ amount: number; currency: string }>;
}
