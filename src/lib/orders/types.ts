import type { OrderStatus } from "@/lib/types";

export interface ShippingAddressSnapshot {
  full_name: string;
  mobile: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  subtotal: number;
  shipping_charge: number;
  tax_amount: number;
  grand_total: number;
  status: OrderStatus;
  payment_method: string | null;
  payment_status: string;
  shipping_address: ShippingAddressSnapshot | null;
  courier_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string | null;
  title_snapshot: string;
  price_snapshot: number;
  quantity: number;
}

export interface OrderStatusHistoryEntry {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface OrderWithDetails {
  order: Order;
  items: OrderItem[];
  history: OrderStatusHistoryEntry[];
}

export interface OrderSummaryRow extends Order {
  item_count: number;
}
