import { HttpException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function handleInvalidIdError(id?: string | object): void {
  if (id && !Types.ObjectId.isValid(id.toString())) {
    throw new BadRequestException(`Invalid id format: ${id}`);
  }
}

export function handleObjNotFound(found: unknown, id: string | object): void {
  if (!found) {
    throw new NotFoundException(`Object with id ${id} not found`);
  }
}

export function handleGeneralServerError(error: any): never {
  if (error instanceof HttpException) {
    throw error;
  }
  throw new InternalServerErrorException(`Internal server error: ${error.message || error.toString()}`);
}
