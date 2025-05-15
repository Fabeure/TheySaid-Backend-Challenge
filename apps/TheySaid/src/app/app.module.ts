import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '@myorg/api-blogs'
import { ApiCoreModule } from '@myorg/api-core'

@Module({
  imports: [BlogModule, ApiCoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
