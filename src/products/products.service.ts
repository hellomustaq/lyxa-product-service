import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RequestUser } from '../auth/rmq-auth.guard';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: ReturnModelType<typeof Product>,
  ) {}

  async create(dto: CreateProductDto, ownerId: string): Promise<Product> {
    const created = await this.productModel.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      ownerId,
    });
    return created;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    currentUser: RequestUser,
  ): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.ownerId !== currentUser.userId) {
      throw new ForbiddenException('Only the owner can update this product');
    }
    const updated = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.price !== undefined && { price: dto.price }),
        },
        { new: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  async remove(id: string, currentUser: RequestUser): Promise<void> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.ownerId !== currentUser.userId) {
      throw new ForbiddenException('Only the owner can delete this product');
    }
    await this.productModel.findByIdAndDelete(id).exec();
  }
}
