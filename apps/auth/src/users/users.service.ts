import {
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UsersRepository } from './users.repository';
  import * as bcrypt from 'bcryptjs';
  
  @Injectable()
  export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}
  
    async create(createUserDto: CreateUserDto) {
      await this.validateCreateUserDto(createUserDto);
      return this.usersRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      });
    }

    async verifyUser(email: string, password: string) {
      const user = await this.usersRepository.findOne({ email: email });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Credentials are incorrect');
      }
      return user;
    }
  
    private async validateCreateUserDto(createUserDto: CreateUserDto) {
      try {
        await this.usersRepository.findOne({ email: createUserDto.email });
      } catch (err) {
        return;
      }
      throw new UnprocessableEntityException('Email already exists.');
    }
  }