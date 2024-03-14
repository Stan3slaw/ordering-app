export interface OrderResponseDto {
  id: number;
  orderId: number;
  name: string;
  details: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
