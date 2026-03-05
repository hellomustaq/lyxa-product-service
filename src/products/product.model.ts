import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Product {
  @prop({ auto: true })
  id: string;

  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  ownerId: string;
}
