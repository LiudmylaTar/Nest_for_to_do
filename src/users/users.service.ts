import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  // Інжектимо модель User (щоб працювати з MongoDB)
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Створення користувача (реєстрація)
  async create(data: { name: string; email: string; password: string }) {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const saltRounds = 10;     //  "Складність" хешування (чим більше — тим безпечніше, але повільніше)


    //  Хешуємо пароль (bcrypt сам додає salt)
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Створюємо нового користувача
    const user = new this.userModel({
      ...data,
      password: hashedPassword, //  замість plain password
    });

    //  Зберігаємо в базу
    return user.save();
  }

  // Пошук користувача по email (потрібно для логіну)
  async findByMail(email: string) {
    return this.userModel.findOne({ email });
  }

  async login(data: { email: string; password: string }) {

  //  Шукаємо користувача по email
  const user = await this.findByMail(data.email);

  if (!user) {
    // якщо не знайдено — не палимо що саме не так
    throw new UnauthorizedException('Invalid email or password');
  }

  //  Порівнюємо пароль з хешем
  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  //  Якщо все ок — повертаємо користувача
  return user;
}
}
