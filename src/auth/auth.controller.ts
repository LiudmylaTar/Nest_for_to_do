import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: RegisterDto) {
    return this.usersService.create(body);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login — returns access_token; use Authorize in Swagger with that value',
  })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Client-side logout placeholder (JWT is stateless)',
  })
  logout() {
    return { message: 'Logout successful' };
  }
}
