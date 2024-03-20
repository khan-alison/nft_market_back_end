import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  findByAddress(@Request() req) {
    return this.usersService.findUserInfoByAddressOrId({
      address: req.user.address,
    });
  }

  @Get(':address')
  findUserInfoByAddress(@Param('address') addr: string) {
    return this.usersService.isValidReferrer({
      addr,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUserInfo(@Request() req, @Body() body: UpdateUserDto) {
    return this.usersService.update(req.user.address, body);
  }

  @Post('upload')
  async performOCRByUrl(@Body() body: { imageUrl: string }) {
    const { imageUrl } = body;
    const result = await this.usersService.performOCR(imageUrl);
    return result;
  }

  @Post('verify-kyc')
  async verifyKyc(@Body() dataKyc: any) {
    // const { imageUrl } = body;
    const result = await this.usersService.verifyKyc(dataKyc);
    return result;
  }
}
