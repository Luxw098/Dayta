import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';

export let USER_KEYS = {};
export let EXCHANGE_KEYS = {
  publicKey: "",
  privateKey: ""
};

let updateKeys = () => {
  const result = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  EXCHANGE_KEYS.publicKey = result.publicKey.toString();
  EXCHANGE_KEYS.privateKey = result.privateKey.toString();
};
setInterval(updateKeys, 21_600_000);
updateKeys();

@Injectable()
class AppService {
  public static getPrivateKey = () => {
    return EXCHANGE_KEYS.privateKey;
  }
  public static getKey = () => {
    return EXCHANGE_KEYS.publicKey.split(/(-.*)|(.*-)/)[3].replace(/\n/g, "");
  }
}
export default AppService;