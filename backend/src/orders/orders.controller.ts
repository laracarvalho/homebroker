import { Body, Post, Get, Param, Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  InputExecuteTransactionDTO,
  StartTransactionDTO,
  ExecuteTransactionMessageDTO,
} from './orders.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('wallets/:wallet_id/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  all(@Param('wallet_id') wallet_id: string) {
    return this.ordersService.all({ wallet_id });
  }

  @Post()
  startTransaction(
    @Param('wallet_id') wallet_id: string,
    @Body() body: Omit<StartTransactionDTO, 'wallet_id'>,
  ) {
    return this.ordersService.startTransaction({
      ...body,
      wallet_id,
    });
  }

  @Post('execute')
  executeTransactionRest(@Body() body: InputExecuteTransactionDTO) {
    return this.ordersService.executeTransaction(body);
  }

  @MessagePattern('output')
  async execureTransactionConsumer(
    @Payload() message: ExecuteTransactionMessageDTO,
  ) {
    const transaction = message.transactions[message.transactions.length - 1];

    await this.ordersService.executeTransaction({
      order_id: message.order_id,
      status: message.status,
      related_investor_id:
        message.order_type === 'BUY'
          ? transaction.seller_id
          : transaction.buyer_id,
      broker_transaction_id: transaction.transaction_id,
      negotiated_shares: transaction.shares,
      price: transaction.price,
    });
  }
}
