import { Injectable } from '@nestjs/common';
import IPrisma from "./prisma.service";
import { createHash } from 'crypto';

@Injectable()
class AccountsService {
  constructor(private readonly prisma: IPrisma) {}
  async find(username: string) {
    return await this.prisma.userData.findUnique({
      where: { username },
    });
  }

  async validateLogin(username: string, pass_hash: string) {
    const account = await this.prisma.userData.findUnique({
      where: { username },
    });
    if (!account) return false;
    return account.passhash == createHash('sha256').update(account.salt + pass_hash).digest('hex');
  }

  async upsert(username: string, pass_hash: string) {
    const salt = Math.random().toString(36).substring(2, 15);
    const data = {
      salt,
      user_hash: username,
      pass_hash: createHash('sha256').update(salt + pass_hash).digest('hex')
    };

    return await this.prisma.userData.upsert({
      where: { username },
      update: {
        passhash: data.pass_hash
      },
      create: {
        username: data.user_hash,
        passhash: data.pass_hash,
        salt: data.salt
      }
    });
  }

  async delete(username: string) {
    return await this.prisma.userData.delete({
      where: { username }
    });
  }
}
export default AccountsService;