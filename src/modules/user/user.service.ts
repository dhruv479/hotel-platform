import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { compareHash, generateHash } from 'src/common/utils/password';
import { createToken } from 'src/common/utils/token';
import { CreateUserDTO, UserLoginDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async userLogin(userLoginDto: UserLoginDTO) {
    const exisingUser = await this.prisma.user.findUnique({
      where: { email: userLoginDto.email },
    });

    if (!exisingUser) {
      throw new UnauthorizedException('Incorrect credentials');
    }
    const hashedPassword = exisingUser.password;

    const passMatch = await compareHash(hashedPassword, userLoginDto.password);
    if (!passMatch) {
      throw new UnauthorizedException('Incorrect credentials');
    }
    const tokenPayload = {
      email: exisingUser.email,
      role: exisingUser.role,
      name: exisingUser.name,
      id: exisingUser.id,
    };
    const token = createToken(tokenPayload);

    return {
      token,
      user: tokenPayload,
    };
  }

  async usersList() {
    return this.prisma.user.findMany({
      select: {
        email: true,
        name: true,
        id: true,
        role: true,
      },
    });
  }

  async createUser(createUserDTO: CreateUserDTO, role: string) {
    const userExist = await this.prisma.user.findFirst({
      where: { email: createUserDTO.email },
    });
    if (userExist) {
      throw new BadRequestException('User exists, try to login');
    }
    const passwordHash = await generateHash(createUserDTO.password);
    await this.prisma.user.create({
      data: {
        ...createUserDTO,
        password: passwordHash,
        role,
      },
    });
    return {
      message: 'User created successfully!',
    };
  }

  async userDetails(userId) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        email: true,
        name: true,
        id: true,
        role: true,
      },
    });
  }
}
