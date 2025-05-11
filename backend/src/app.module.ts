import { Module } from '@nestjs/common';
import * as imports from "./imports";
import allimports from "./imports";
import EmailsService from './db/emails.service';

// Comment out items below if you do not require them
// Please do not edit my options, You may comment them out
// You may add your own options
@Module({
  controllers: [].concat(...[
    imports.appControllers, // Main app controller
    imports.authControllers,
    imports.apiControllers, // Backend API
  ]),
  providers: [].concat(...[
    imports.appProviders, // Main app controller
    imports.dbProviders, // Prisma connection (sqlite)
    imports.authProviders,
    imports.socketsProviders, // Socket.io WS serve

    EmailsService
  ]),
  exports: [ allimports.IAccounts, allimports.IJwt, allimports.IPrisma, EmailsService],
})
export class AppModule { }
