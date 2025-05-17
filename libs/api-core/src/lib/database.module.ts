import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '@myorg/api-models'

// libs/api/core/src/lib/database.module.ts
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env['POSTGRES_HOST'] || 'localhost',
            port: parseInt(process.env['POSTGRES_PORT'] || '5432', 10),
            username: process.env['POSTGRES_USER'] || 'postgres',
            password: process.env['POSTGRES_PASSWORD'] || 'admin',
            database: process.env['POSTGRES_DB'] || 'test',
            autoLoadEntities: true,
            synchronize: true,
            entities: [Blog]
        }),
    ],
})
export class DatabaseModule { }