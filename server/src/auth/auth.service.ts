import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findOneByEmail(email);
        const isMatch = await this.userService.comparePassword(password, user.password);
        if (!isMatch) {
            throw new BadRequestException("Incorrect username or password");
        }
        const { password: _, ...result } = user;
        return result;
    }

    async login(user:any){
        const payload = {email:user.email,id: user.id};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
