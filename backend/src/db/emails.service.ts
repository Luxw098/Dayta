import { Injectable } from '@nestjs/common';
import IPrisma from "./prisma.service";

@Injectable()
class EmailsService {
  constructor(private readonly prisma: IPrisma) {}

  async set(email: string) {
    return await this.prisma.usedEmail.create({
      data: {
        email
      }
    });
  }

  async check(email: string) {
    return await this.prisma.usedEmail.findUnique({
      where: {
        email
      }
    });
  }

  //Lack of deletion on purpose.
}
export default EmailsService;