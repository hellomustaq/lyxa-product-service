import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UserEventsHandler } from './users/user-events.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypegooseModule.forRoot(
      process.env.PRODUCT_MONGO_URI ||
        'mongodb://localhost:27017/product-service',
    ),
    ProductsModule,
  ],
  controllers: [AppController, UserEventsHandler],
  providers: [AppService],
})
export class AppModule {}
