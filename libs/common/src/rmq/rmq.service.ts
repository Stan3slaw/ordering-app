import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RmqContext, RmqOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  public getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }

  public ack(context: RmqContext): void {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
