export interface OrderEntity {
  id: number;
  order_id: number;
  name: string;
  details: string | null;
  total_price: number;
  created_at: Date;
  updated_at: Date;
}
