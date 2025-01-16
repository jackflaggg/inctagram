import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/user-accounts/user-accounts.module';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/top-api'),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        TestingModule,
        BloggersPlatformModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
