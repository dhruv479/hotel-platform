import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypes } from 'src/common/dto/base.dto';
import { CreateReservationDTO, EnquireReservationDTO } from './reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('/all')
  @Roles([UserTypes.ADMIN])
  getAllReservationList() {
    return this.reservationService.getReservations();
  }

  @Get('/list')
  getReservations(@Req() req: Request) {
    const { id: userId } = req.USER;
    return this.reservationService.getReservations(userId);
  }

  @Post('/enquire')
  enquireReservation(@Body() payload: EnquireReservationDTO) {
    return this.reservationService.enquireReservations(payload);
  }

  @Post('/create')
  createReservation(
    @Body() payload: CreateReservationDTO,
    @Req() req: Request,
  ) {
    const { id: userId } = req.USER;
    return this.reservationService.createReservation(payload, userId);
  }
}
