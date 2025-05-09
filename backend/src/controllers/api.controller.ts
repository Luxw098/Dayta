import { Controller, Get, Render } from '@nestjs/common';
import imports from '../imports';
import { readdirSync } from 'fs';
import { join } from 'path';

@Controller("/api")
export class ApiController {
  @Get()
  get() {
    return {
      status: "ok",
      code: "200",
      message: "API is running"
    };
  }

  @Get("/getKey")
  getKey() {
    return {
      key: imports.IAppService.getKey() || "N/A"
    };
  };
}
export default ApiController;