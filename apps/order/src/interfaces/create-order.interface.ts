export interface CreateOrder {
  order_id: number;
  name: string;
  total_price: number;
  details?: string;
}
