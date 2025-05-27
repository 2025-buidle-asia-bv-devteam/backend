import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify-wallet')
  async verifyWallet(
    @Body() body: { address: string; signature: string; message: string },
  ) {
    const isValid = await this.authService.verifyWalletSignature(
      body.address,
      body.signature,
      body.message,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    const token = this.authService.generateToken(body.address);
    return { token };
  }
} 