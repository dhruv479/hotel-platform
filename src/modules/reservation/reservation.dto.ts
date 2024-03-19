import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinDate,
} from 'class-validator';

export class EnquireReservationDTO {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  from_date: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  to_date: string;

  @IsNumber()
  @Min(1)
  num_rooms: number;
}

export class CreateReservationDTO {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  from_date: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  to_date: string;

  @IsNumber()
  @Min(1)
  num_rooms: number;

  @IsNumber()
  @Min(1)
  hotel_id: number;
}
