import { Injectable } from '@nestjs/common';
import imports from "../imports";
import IPrisma from "./prisma.service";
import IAccounts from "./accounts.service";
import { sign } from 'jsonwebtoken';
import EncryptionUtils from 'src/util/EncryptionUtils';

@Injectable()
class JwtService {
  constructor(private readonly prisma: IPrisma,
    private readonly accounts: IAccounts) {}

  async create(username: string) {
    const random = Math.round(Math.random() * 1000);
    const token = sign({ username, random }, imports.IAppService.getPrivateKey(), {
      algorithm: 'RS256',
      expiresIn: '12h'
    });
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

  async SendJWTRes(user: string) {
    const jwt = await this.create(user);
    const jwt_chunks = this.chunkJWT(jwt);
    return {
      status: "ok",
      code: 200,
      body: {
        start: "jwt=",
        jwt0: jwt_chunks[0],
        jwt1: jwt_chunks[1],
        jwt2: jwt_chunks[2],
        jwt3: jwt_chunks[3],
        end: "; Secure; SameSite=Strict; Path=/;"
      }
    };
  }
	formJWT(body: any) {
		const new_jwt = body["jwt0"] + body["jwt1"] + body["jwt2"] + body["jwt3"];
		return new_jwt;
	};
  chunkJWT(jwt: string) {
    const chunks = [];
    const chunk_size = Math.ceil(jwt.length / 4);
    const count = jwt.length / chunk_size;
    for (let i = 0; i < count; i++) {
      chunks[i] = jwt.substring((chunk_size * i), (chunk_size * (i + 1)))
    };
    return chunks;
  }
}
export default JwtService;
