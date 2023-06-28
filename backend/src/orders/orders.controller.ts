import { Body, Post, Get, Param, Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { InputExecuteTransactionDTO, StartTransactionDTO } from './orders.dto';

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
  executeTransaction(@Body() body: InputExecuteTransactionDTO) {
    return this.ordersService.executeTransaction(body);
  }
}
