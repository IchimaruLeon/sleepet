import {
    Injectable,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UsersRepository } from './users.repository';
  
  @Injectable()
  export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}
  
    async create(createUserDto: CreateUserDto) {
      await this.validateCreateUserDto(createUserDto);
      return this.usersRepository.create({
        ...createUserDto
      });
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