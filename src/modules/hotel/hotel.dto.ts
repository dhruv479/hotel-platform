import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class AddHotelDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(1)
  num_rooms: number;

  @IsNumber()
  @Min(1)
  room_price: number;
}
