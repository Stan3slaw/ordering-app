import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  MAX_PASSWORD_CHARACTERS,
  MIN_PASSWORD_CONFIRMATION_CHARACTERS,
} from '../constants/dtos.constants';

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @MaxLength(MAX_PASSWORD_CHARACTERS, {
    message: 'password max length is 60 characters',
  })
  readonly password: string;

  @IsNotEmpty({ message: 'password confirmation should not be empty' })
  @IsString({ message: 'password confirmation must be a string' })
  @MinLength(MIN_PASSWORD_CONFIRMATION_CHARACTERS, {
    message: 'password confirmation min length is 1 character',
  })
  readonly passwordConfirmation: string;
}
