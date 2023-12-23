import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import User from './models/user.model';
import { v4 as UUIDV4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create_user(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) return existingUser;
    const newUser = new this.userModel({
      username: createUserDto.username,
      image: createUserDto.image,
      email: createUserDto.email,
    });
    return await newUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const newId = UUIDV4(id);

    return await this.userModel.findByPk(newId);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
