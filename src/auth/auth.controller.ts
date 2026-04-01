import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
constructor(private readonly usersService: UsersService,
            private readonly authService: AuthService) {}

@Post('register')
async register(@Body() body: RegisterDto) {
  return this.usersService.create(body);
}

@Post('login')
async login(@Body() body: LoginDto) {
  return this.authService.login(body);
}

  @Post('logout')
  logout() {
    return { message: 'Logout successful' };
  }
}
