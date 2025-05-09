import { Controller, Get, Post, Body } from '@nestjs/common';
import JwtService from '..//db/jwt.service';
import AccountsService from "../db/accounts.service";
import EncryptionUtils from 'src/util/EncryptionUtils';

@Controller("/api/auth")
export class AuthController {
  constructor(
              private readonly jwt: JwtService,
              private readonly accounts: AccountsService
  ) {}

  @Get()
  get() {
    return {
      status: "ok",
      code: "200",
      message: "Auth API is running"
    };
  }

  @Post("/updatesession")
  async getUpdateSession(@Body() body: any) {
    console.log(EncryptionUtils.decryptData(body["user"]));

    const jwt = EncryptionUtils.decryptData(body["user"]);

    const jwt_data = await this.jwt.find(body["user"]);
    if (!jwt_data) return {
      status: "error",
      code: "404"
    };

    if (jwt_data.jwt != jwt) return {
      status: "error",
      code: "401"
    };

    return {
      status: "ok",
      code: "200",
      headers: {
        "set-cookie": `jwt=${jwt}; Secure; SameSite=Strict; Path=/;`
      }
    };
  }

  @Post("/register")
  async getRegister(@Body() body: any) {
    
  }

  @Post("/login")
  async getLogin(@Body() body: any) {

  }
}
export default AuthController