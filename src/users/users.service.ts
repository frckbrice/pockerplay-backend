import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import User from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create_user(createUserDto: CreateUserDto) {
    const existingUser = new this.userModel({
      username: createUserDto.username,
    });

    const newUser = await existingUser.save();

    if (newUser) {
      console.log('existing user', existingUser);
      return existingUser;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return await this.userModel.findByPk(id);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
