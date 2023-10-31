import { LoggerService, Logger, Inject, forwardRef, UnprocessableEntityException, InternalServerErrorException, NotFoundException, Injectable, BadGatewayException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { REFRESHTOKEN_REPOSITORY } from 'src/core/constants';
import { RefreshToken } from './entities/refreshtoken.entity';
import { TokenExpiredError } from 'jsonwebtoken';
import { ChangePasswordDto } from '../users/dto/changepassword.dto';
import { UserAdDto } from '../users/dto/userad.dto';
import { DepartmentsService } from '../departments/departments.service';
import { Client } from 'openid-client';
import { EsaToken } from './entities/esatoken.entity';
const ms = require('ms');

export interface RefreshTokenPayload {
    jti: number;
    sub: number
}

@Injectable()
export class AuthService {
    constructor(@Inject(REFRESHTOKEN_REPOSITORY) private readonly refreshtokenRepository: typeof RefreshToken,
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,
        private readonly rolesService: RolesService,
        private readonly jwtService: JwtService,
        private readonly departmentService: DepartmentsService,
        @Inject(Logger) private readonly logger: LoggerService,
        @Inject("OpenIdClient") private readonly openIdClient: {
            client: Client,
            code_verifier: string
        }
    ) { }

    decode(token: string) {
        return this.jwtService.decode(token);
    }

    verify(token: string) {
        return this.jwtService.verify(token);
    }

    async validateUser(username: string, pass: string) {
        const user = await this.userService.findOneByEmail(username) ||
            await this.userService.findOneByLogin(username);
        if (!user || user.deleted) {
            return null;
        }

        let match = false;
        match = await this.comparePassword(pass, user.password);

        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        return user;
    }

    public async login(user) {
        const token = this.generateToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return {
            user: await this.userService.findOneById(user.id),
            //user: await this.userService.normalize(await this.userService.findOneById(user.id)),
            token,
            refreshToken
        };
    }

    async logout(user) {
        if(user.aduath)
            await EsaToken.destroy({
                where: {
                    userId: user.id    
                }
            });
        return await this.refreshtokenRepository.destroy({
            where: {
                userId: user.id
            }
        });
    }

    public async create(user) {
        // hash the password
        const pass = user.password ? await this.hashPassword(user.password) : null;

        // create the user
        const newUser: User = await this.userService.create({ ...user, password: pass });

        const result = await this.userService.normalize(newUser);
        const token = this.generateToken(result);
        const refreshToken = await this.generateRefreshToken(result);

        // return the user and the token
        return { user: result, token, refreshToken };
    }

    public generateToken(user) {
        let usr = { ...user };
        delete usr.password;
        const token = this.jwtService.sign(usr);
        return token;
    }

    async generateRefreshToken(user) {
        let refreshToken = await this.refreshtokenRepository.findOne({
            where: {
                userId: user.id
            }
        });

        if (refreshToken)
            await refreshToken.destroy();

        refreshToken = await this.refreshtokenRepository.create({
            userId: user.id,
            expires_in: new Date().getTime() + ms(process.env.JWT_REFRESH_TOKEN_EXP)
        });

        return this.jwtService.sign({}, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
            subject: String(user.id),
            jwtid: String(refreshToken.id)
        });
    }

    public async generateAccessTokenFromRefreshToken(refresh: string): Promise<{ token: string, user: {} }> {
        const { user } = await this.resolveRefreshToken(refresh);
        return await this.login(await this.userService.normalize(user));
    }

    public async resolveRefreshToken(encoded: string): Promise<{ user: User, token: RefreshToken }> {
        const payload = this.decodeRefreshToken(encoded);
        if (!payload.jti)
            throw new UnprocessableEntityException('Refresh token malformed');
        const token = await this.refreshtokenRepository.findByPk(payload.jti);

        if (!token)
            throw new UnprocessableEntityException('Refresh token not found');

        if (token.isRevoked)
            throw new UnprocessableEntityException('Refresh token revoked');

        if (!payload.sub)
            throw new UnprocessableEntityException('Refresh token malformed');

        const user = await this.userService.findOneById(payload.sub);

        if (!user)
            throw new UnprocessableEntityException('Refresh token malformed');

        return { user, token };
    }

    private decodeRefreshToken(token: string): RefreshTokenPayload {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnprocessableEntityException('Refresh token expired');
            } else {
                throw new UnprocessableEntityException('Refresh token malformed');
            }
        }
    }

    public async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

    async changePassword(request: any, dto: ChangePasswordDto): Promise<Boolean> {
        let result = false;
        const user = await this.validateUser(request.user.login, dto.oldPassword);
        if (user) {
            await user.update({ password: await this.hashPassword(dto.newPassword) });
            result = true;
        }

        return result;
    }

    async findInEsa(user: User) {
        let userinfo = null;
        let error = null;

        try {
            userinfo = await this.openIdClient.client.userinfo(user.esatoken.access_token);
        } catch (ex) {
            this.logger.warn(ex);
            error = ex.error;
        }

        if(error == "invalid_token") {
            this.logger.log("Trying to refresh access token in ESA for " + user.login);
            try {
                user.esatoken.access_token = (await this.openIdClient.client.refresh(user.esatoken.refresh_token)).access_token;
                await user.esatoken.save();
                userinfo = await this.openIdClient.client.userinfo(user.esatoken.access_token);
                this.logger.log("Token refreshed!");
            } catch (ex) {
                this.logger.warn(ex);
                throw new ForbiddenException(ex);
            }
        }
        
        if (userinfo == null || !userinfo.hasOwnProperty("preferred_username") ||
            !userinfo.hasOwnProperty("email") || !userinfo.hasOwnProperty("given_name")
            || !userinfo.hasOwnProperty("family_name"))
            throw new NotFoundException(error);
    }

    async openIdCallback(httpRequest) {
        if (this.openIdClient.client == null)
            throw new BadGatewayException("Can't connect to ESA");

        let origin = httpRequest.get("origin");
        if(!origin)
            origin = new URL(httpRequest.get("referer")).origin;

        origin = origin + process.env.OPENID_REDIRECT_PATH;

        const params = this.openIdClient.client.callbackParams(httpRequest);
        let tokenSet = null;
        try {
            tokenSet = await this.openIdClient.client
            .callback(origin, params, {
                code_verifier: this.openIdClient.code_verifier,
                state: params.state
            });
        } catch (ex) {
            this.logger.error(ex);
            throw new InternalServerErrorException(ex.message);
        }

        const userinfo = await this.openIdClient.client.userinfo(tokenSet.access_token);
        // let givenName = userinfo.hasOwnProperty("given_name") ? 
        //     userinfo.preferred_username : userinfo.preferred_username;
        // let familyName = userinfo.hasOwnProperty("family_name") ? 
        //     userinfo.family_name : userinfo.preferred_username;
        if (userinfo == null || !userinfo.hasOwnProperty("preferred_username") ||
            !userinfo.hasOwnProperty("email"))
            throw new NotFoundException(
                `Не удаось найти корректную запись в ESA. Полученный результат: ${JSON.stringify(userinfo)}`);

        let dbUser = await this.userService.findOneByLogin(userinfo.preferred_username);

        if(!dbUser)
            throw new NotFoundException("Пользователь не найден");

        if (dbUser && !dbUser.adauth)
            throw new ForbiddenException("User is not AD auth");

        // if(!dbUser) { //--Sign-UP--
        //     if (dbUser && dbUser.login == userinfo.preferred_username)
        //         throw new ForbiddenException(`This ESA login already exist: ${userinfo.preferred_username}`);

        //     if (dbUser && dbUser.email == userinfo.email)
        //         throw new ForbiddenException(`This ESA email already exist: ${userinfo.email}`);            

        //     dbUser = new User({
        //         login: userinfo.preferred_username,
        //         email: userinfo.email,
        //         name: givenName,
        //         lastname: familyName,
        //         patronymic: <string>userinfo.middle_name,
        //         adauth: true
        //     });

        //     await dbUser.save();
        //     await dbUser.addRole(await this.rolesService.findOneByName("employeero"));
        //     // if (newUser.id && userinfo.hasOwnProperty("department")) {
        //     //     //--Найти подразделение в системе--
        //     //     let department = await this.departmentService.findOneByName(<string>userinfo.department);
        //     //     if (!department) {
        //     //         department = await this.departmentService.create(null, {
        //     //             name: <string>userinfo.department
        //     //         });
        //     //     }

        //     //     newUser.setDepartment(department);
        //     //     await newUser.addRole(await this.rolesService.findOneByName("employeero"));

        //     //     return await this.login(await this.userService.normalize(newUser));
        //     // } else
        //     //     throw new InternalServerErrorException("Can't create user!");
        // }

        let esaToken = await EsaToken.findOne({
            where: {
                userId: dbUser.id
            }
        });
        if(!esaToken)
            esaToken = new EsaToken({
                userId: dbUser.id
            });

        esaToken.access_token = tokenSet.access_token;
        esaToken.refresh_token = tokenSet.refresh_token;
        await esaToken.save();

        return await this.login(
            await this.userService.normalize(await this.userService.findOneById(dbUser.id)));
    }
}