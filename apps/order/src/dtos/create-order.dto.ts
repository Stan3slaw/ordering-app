import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsString()
  details?: string;
}
