import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ERROR400, ERROR401, ERROR404, ERROR409 } from 'src/errors';
import EncryptionUtils from 'src/util/EncryptionUtils';
import AccountsService from "../db/accounts.service";
import EmailsService from 'src/db/emails.service';
import JwtService from '../db/jwt.service';

@Controller("/api/auth")
export class AuthController {
  constructor(
              private readonly jwt: JwtService,
              private readonly email: EmailsService,
              private readonly accounts: AccountsService
  ) {}

  @Get()
  get() {
    return {
      status: "ok",
      code: "200",
      body: "Auth API is running"
    };
  }

  @Get("/userexists")
  async getUser(@Query() user: any) {
    const found = await this.accounts.find(user["user"]);
    if (found) return {
      status: "ok",
      code: "200"
    };

    return ERROR404;
  }

  @Post("/updatesession")
  async getUpdateSession(@Body() body: any) {
    const user = EncryptionUtils.decryptData(body["user"]);

    const jwt = this.jwt.formJWT(body);
    const jwt_data = await this.jwt.find(user);
    if (!jwt_data) return ERROR404;
    console.log(jwt_data.jwt)
    console.log(jwt)
    if (jwt_data.jwt != jwt) return ERROR401

    return this.jwt.SendJWTRes(user);
  }

  @Post("/register")
  async getRegister(@Body() body: any) { //ill add sanitisation later btw
    const email = EncryptionUtils.decryptData(body["email"]);
    const user = EncryptionUtils.decryptData(body["user"]);
    const pass = EncryptionUtils.decryptData(body["pass"]);
    console.log(email, user, pass)
    if (!email || !user || !pass) return ERROR400;

    const exists = await this.accounts.find(user);
    if (exists) return ERROR409;

    const emailUsed = await this.email.check(email);
    if (emailUsed) return ERROR409;
    await this.email.set(email);

    const account = await this.accounts.upsert(user, pass);
    console.log(`Created user:\n`, account);

    return this.jwt.SendJWTRes(user);
  }

  @Post("/login")
  async getLogin(@Body() body: any) {
    const user = EncryptionUtils.decryptData(body["user"]);
    const pass = EncryptionUtils.decryptData(body["pass"]);
    if (!user || !pass) return ERROR400;

    const found = this.accounts.find(user);
    if (!found) return ERROR404;

    return this.jwt.SendJWTRes(user);
  }
}
export default AuthController