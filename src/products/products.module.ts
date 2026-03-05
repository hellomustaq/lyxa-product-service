import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Product } from './product.model';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypegooseModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
