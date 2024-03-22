import { HttpException, HttpStatus } from '@nestjs/common';

export async function throwInternalError<T>(promise: Promise<T>): Promise<T> {
  try {
    const result = await promise;

    return result;
  } catch (error) {
    console.error(error);
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
