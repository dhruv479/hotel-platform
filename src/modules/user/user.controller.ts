import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypes } from 'src/common/dto/base.dto';
import { Request } from 'express';
import { CreateUserDTO, UserLoginDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  userLogin(@Body() payload: UserLoginDTO) {
    return this.userService.userLogin(payload);
  }

  @Post('/create')
  @Roles([UserTypes.ADMIN])
  createUser(@Body() payload: CreateUserDTO) {
    return this.userService.createUser(
      payload,
      payload.role || UserTypes.DEFAULT,
    );
  }

  @Post('/signup')
  signupUser(@Body() payload: CreateUserDTO) {
    return this.userService.createUser(payload, UserTypes.DEFAULT);
  }

  @Get('/list')
  @Roles([UserTypes.ADMIN])
  userList() {
    return this.userService.usersList();
  }

  @Get('/details')
  userDetails(@Req() req: Request) {
    const { id: userId } = req.USER;
    return this.userService.userDetails(userId);
  }
}
