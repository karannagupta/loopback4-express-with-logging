import {Model, model, property} from '@loopback/repository';

@model()
export class ErrorLogger extends Model {
  @property({
    type: 'string',
    required: true,
  })
  message: string;


  constructor(data?: Partial<ErrorLogger>) {
    super(data);
  }
}
