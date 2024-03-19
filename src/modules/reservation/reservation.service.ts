import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { CreateReservationDTO, EnquireReservationDTO } from './reservation.dto';
import { Prisma } from '@prisma/client';
import {
  PendingReservationStatuses,
  ReservationStatuses,
} from './reservation.constant';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async getReservations(userId?: number) {
    let hotels;
    if (userId) {
      hotels = await this.prisma.$queryRaw`
        SELECT 
          hotel.name as hotel_name, hotel.address as hotel_address, reservation.from_date, reservation.to_date, 
          reservation.num_rooms, reservation.status as reservation_status, user.name as user_name, reservation.total_price 
        FROM 
          reservation 
        JOIN 
          hotel ON hotel.id = reservation.hotel_id 
        JOIN 
          user ON user.id = reservation.user_id 
        WHERE reservation.user_id = ${userId}`;
    } else {
      hotels = await this.prisma.$queryRaw`
        SELECT 
          hotel.name as hotel_name, hotel.address as hotel_address, reservation.from_date, reservation.to_date, 
          reservation.num_rooms, reservation.status as reservation_status, user.name as user_name, reservation.total_price 
        FROM 
          reservation 
        JOIN 
          hotel ON hotel.id = reservation.hotel_id 
        JOIN 
          user ON user.id = reservation.user_id`;
    }
    return hotels;
  }

  async enquireReservations(payload: EnquireReservationDTO) {
    const { from_date, to_date, city, num_rooms } = payload;
    if (from_date > to_date) {
      throw new BadRequestException('To Date should be greater than From Date');
    }
    return this.prisma.$queryRaw`
      SELECT 
        hotel.name, hotel.id as hotel_id, hotel.address, hotel.image, hotel.rating, hotel.city, hotel.room_price
      FROM 
        hotel 
      LEFT JOIN 
        reservation rs ON rs.hotel_id = hotel.id 
            AND ((rs.from_date < ${from_date} AND rs.to_date > ${from_date}) 
            OR (rs.from_date < ${to_date} AND rs.to_date > ${to_date}) 
            OR (rs.from_date <= ${from_date} AND rs.to_date >= ${to_date})) 
      WHERE
        hotel.city = ${city}
        AND (rs.status IN (${Prisma.join(PendingReservationStatuses)}) OR rs.status IS NULL)
      GROUP BY hotel.id HAVING COALESCE(SUM(rs.num_rooms), 0) <= hotel.num_rooms - ${num_rooms}
    `;
  }

  async createReservation(payload: CreateReservationDTO, userId: number) {
    const { hotel_id, from_date, to_date, num_rooms } = payload;
    if (from_date > to_date) {
      throw new BadRequestException('To Date should be greater than From Date');
    }
    const queryResult: any = await this.prisma.$queryRaw`
      SELECT 
        hotel.id as hotel_id, hotel.room_price
      FROM 
        hotel 
      LEFT JOIN 
        reservation rs ON rs.hotel_id = hotel.id 
            AND ((rs.from_date < ${from_date} AND rs.to_date > ${from_date}) 
            OR (rs.from_date < ${to_date} AND rs.to_date > ${to_date}) 
            OR (rs.from_date <= ${from_date} AND rs.to_date >= ${to_date})) 
      WHERE
        hotel.id = ${hotel_id}
        AND (rs.status IN (${Prisma.join(PendingReservationStatuses)}) OR rs.status IS NULL)
      GROUP BY hotel.id HAVING COALESCE(SUM(rs.num_rooms), 0) <= hotel.num_rooms - ${num_rooms}
    `;
    if (queryResult.length === 0) {
      throw new BadRequestException('Hotel not available for booking');
    }
    const hotelData = queryResult[0];
    const totalPrice = Math.round(hotelData.room_price * num_rooms);
    await this.prisma.reservation.create({
      data: {
        from_date,
        to_date,
        num_rooms,
        hotel_id,
        status: ReservationStatuses.BOOKED,
        user_id: userId,
        total_price: totalPrice,
      },
    });
    return {
      message: 'Booking created successfully!',
    };
  }
}
