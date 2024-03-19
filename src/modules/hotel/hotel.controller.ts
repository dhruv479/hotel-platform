import { Body, Controller, Get, Post } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { AddHotelDTO } from './hotel.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypes } from 'src/common/dto/base.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('create')
  @Roles([UserTypes.ADMIN])
  createHotel(@Body() payload: AddHotelDTO) {
    return this.hotelService.createHotel(payload);
  }

  @Get('list')
  hotelList() {
    return this.hotelService.hotelListing();
  }
}
