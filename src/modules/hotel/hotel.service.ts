import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { AddHotelDTO } from './hotel.dto';
import { Hotel } from '@prisma/client';

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async createHotel(addHotelDTO: AddHotelDTO) {
    await this.prisma.hotel.create({
      data: addHotelDTO,
    });
    return {
      message: 'Hotel created successfully!',
    };
  }

  async hotelListing(): Promise<Hotel[]> {
    return this.prisma.hotel.findMany();
  }
}
