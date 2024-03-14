import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LoggerModule } from '@app/common';
import { OrderApiProxyService } from './order-api-proxy.service';
import { OrderApiService } from './order-api.service';

@Module({
  imports: [HttpModule, LoggerModule],
  providers: [OrderApiProxyService, OrderApiService],
  exports: [OrderApiService],
})
export class OrderApiModule {}
