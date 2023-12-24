import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import User from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create_user(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      console.log('existing user', existingUser);
      return existingUser;
    } else {
      console.log('not existing user');
      const newUser = new this.userModel({
        username: createUserDto.username,
        image: createUserDto.image,
        email: createUserDto.email,
      });

      const storedUser = await newUser.save();
      console.log(storedUser);
      return storedUser;
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
