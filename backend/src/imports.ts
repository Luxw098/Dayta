import IApp from "./controllers/app.controller";

import IApi from "./controllers/api.controller";
import IAuth from "./controllers/auth.controller";

import IAppService from "./app.service"
import IPrisma from "./db/prisma.service";
import IAccounts from "./db/accounts.service";
import IJwt from "./db/jwt.service";

import ISocket from "./gateways/wss.gateway";

export default {
  IAppService,
  IApp,
  IApi,
  IAuth,
  IPrisma,
  IAccounts,
  IJwt
}

export const appControllers = [ IApp ];
export const authControllers = [ IAuth ];
export const apiControllers = [ IApi ];

export const appProviders = [ IAppService ];
export const dbProviders = [ IPrisma ]
export const authProviders = [ IAccounts, IJwt ];
export const socketsProviders = [ ISocket ];