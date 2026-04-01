import { Injectable } from '@nestjs/common';
import {   UnauthorizedException  } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // інжектимо UsersService
    private jwtService: JwtService,     // інжектимо JwtService
  ) {}

  async login(data: { email: string; password: string }) {

    // 🔹 беремо користувача з UsersService
    const user = await this.usersService.findByMail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
    };

    const { password: _password, ...safeUser } = user.toObject();

    return {
      access_token: this.jwtService.sign(payload),
      user: safeUser,
    };
  }
}