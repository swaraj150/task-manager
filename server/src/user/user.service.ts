import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  
  constructor(private readonly prismaService:PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prismaService.user.create({
      data:{
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      }
    })
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where:{
        id,
      }
    })
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
  async findOneByEmail(email: string) {
    const user =  await this.prismaService.user.findUnique({
      where:{
        email,
      }
    })
    if (!user) throw new NotFoundException(`User ${email} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return this.prismaService.user.update({
      where:{
        id,
      },
      data:updateUserDto
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prismaService.user.delete({ where: { id } });
  }

  comparePassword(password: string, userPassword: string) {
    return bcrypt.compare(password,userPassword);
  }
}
