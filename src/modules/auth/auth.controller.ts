import { Controller, Body, Post, UseGuards, Request, Response, ClassSerializerInterceptor, Get, UseInterceptors, Put, Req, BadRequestException, LoggerService, Inject, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { DoesUserExist } from '../users/guards/doesUserExist.guard';
import { User } from '../users/entities/user.entity';
import { SignupUserDto } from '../users/dto/signup.user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshRequestDto } from './dto/refresh.jwt.dto';
import { ResponseUserDto } from '../users/dto/response.user.dto';
import { UsersService } from '../users/users.service';
import { ResponseUserLoginDto } from './dto/response.user.login.dto';
import { ChangePasswordDto } from '../users/dto/changepassword.dto';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private usersService: UsersService,
        @Inject(Logger) private readonly logger: LoggerService) { }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('current')
    async current(@Request() req): Promise<ResponseUserDto> {
        const user = await this.usersService.findOneByLogin(req.user.login);
        if(user && user.adauth) {
            await this.authService.findInEsa(user);
        }
        return new ResponseUserDto(
            await this.usersService.normalize(await this.usersService.findOneByLogin(req.user.login)));
    }

    @Get("openidcallback")
    @UseInterceptors(ClassSerializerInterceptor)
    async openIdCallback(@Request() req): Promise<ResponseUserLoginDto> {
        return new ResponseUserLoginDto(await this.authService.openIdCallback(req));
    }

    @UseGuards(AuthGuard('local'))
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('login')
    async login(@Request() req): Promise<ResponseUserLoginDto> {
        return new ResponseUserLoginDto(await this.authService.login(req.user));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout(@Request() req) {
        return await this.authService.logout(req.user);
    }

    @ApiOperation({ summary: "Создание пользователя" })
    @ApiResponse({ status: 200, type: User })
    @UseGuards(DoesUserExist)
    @Post('signup')
    async signUp(@Body() user: SignupUserDto) {
        return await this.authService.create(user);
    }

    // @UseGuards(DoesUserExist)
    // @UseInterceptors(ClassSerializerInterceptor)
    // @Post('signupad')
    // async signUpAd(@Body() user: UserAdDto): Promise<ResponseUserLoginDto> {
    //     return new ResponseUserLoginDto(await this.authService.signUpAd(user));
    // }

    @Post('refresh')
    public async refresh(@Body() body: RefreshRequestDto) {
        return await this.authService.generateAccessTokenFromRefreshToken(body.refreshToken);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put("changePassword")
    async changePassword(@Req() request, @Body() dto: ChangePasswordDto): Promise<Boolean> {
        if (!await this.authService.changePassword(request, dto))
            throw new BadRequestException();

        return true;
    }
}