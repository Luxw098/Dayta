import { Controller, Get, Post, Body } from '@nestjs/common';
import JwtService from '..//db/jwt.service';
import AccountsService from "../db/accounts.service";
import imports from "../imports";

import { privateDecrypt } from "crypto";

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
  async getUpdateSession() {
    return {
      status: "ok",
      code: "200",
      message: ""
    }
  }

  @Post("/register")
  async getRegister(@Body() body: any) {

  }

  @Post("/login")
  async getLogin(@Body() body: any) {
    try {
      const private_key = imports.IAppService.getPrivateKey();
      const decryption_settings = {
        key: private_key,
        oaepHash: "sha256"
      };

      const username = privateDecrypt(decryption_settings, Buffer.from(body["user"], 'base64')).toString();
      if (!this.accounts.exists(username)) return {
        status: "error",
        code: 404
      };

      const pass_hash = privateDecrypt(decryption_settings, Buffer.from(body["pass"], 'base64')).toString();
      
      if (!username || !pass_hash) return;

      const result = await this.jwt.create(
        username,
        pass_hash
      );
      if (!result) return {
        status: "error",
        code: 401
      };

      return {
        status: "ok",
        code: 200,
        message: result
      };
    } catch {
      return {
        status: "error",
        code: 400
      };
    }
  }
}
export default AuthController