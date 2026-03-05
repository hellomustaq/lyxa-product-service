import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RmqAuthGuard, RequestUser } from '../auth/rmq-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RmqAuthGuard)
  async create(
    @Body() dto: CreateProductDto,
    @Req() req: { user: RequestUser },
  ) {
    const product = await this.productsService.create(dto, req.user.userId);
    return product;
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RmqAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: { user: RequestUser },
  ) {
    return this.productsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(RmqAuthGuard)
  async remove(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    await this.productsService.remove(id, req.user);
  }
}
