import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '@myorg/api-models'

// libs/api/core/src/lib/database.module.ts
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin',
            database: 'test',
            autoLoadEntities: true,
            synchronize: true,
            entities: [Blog]
        }),
    ],
})
export class DatabaseModule { }