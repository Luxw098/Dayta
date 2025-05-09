import { Injectable } from '@nestjs/common';
import imports from "../imports";
import IPrisma from "./prisma.service";
import IAccounts from "./accounts.service";
import { sign } from 'jsonwebtoken';

@Injectable()
class JwtService {
  constructor(private readonly prisma: IPrisma,
    private readonly accounts: IAccounts) {}

  async create(username: string, pass_hash: string) {
    const found_acc = await this.accounts.find(username);
    if (found_acc != null) return found_acc;

    const token = btoa(sign({ username, pass_hash }, imports.IAppService.getPrivateKey(), {
      algorithm: 'RS256',
      expiresIn: '12h'
    }));
    await this.prisma.jwtData.upsert({
      where: {
        username,
      },
      update: {
        jwt: token,
        expires: new Date(Date.now() + 43_200_000) // 12 hours
      },
      create: {
        jwt: token,
        username,
        expires: new Date(Date.now() + 43_200_000) // 12 hours
      },
    });
    return token;
  }

  async find(username: string) {
    return await this.prisma.jwtData.findUnique({
      where: {
        username
      }
    });
  }

  async delete(username: string) {
    return await this.prisma.jwtData.delete({
      where: {
        username
      },
    });
  }
}
export default JwtService;
