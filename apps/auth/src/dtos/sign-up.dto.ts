import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import {
  MAX_EMAIL_CHARACTERS,
  MAX_NAME_CHARACTERS,
} from '../constants/dtos.constants';
import { PasswordDto } from './password.dto';

export class SignUpDto extends PasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_NAME_CHARACTERS, {
    message: 'name max length is 60 characters',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(MAX_EMAIL_CHARACTERS, {
    message: 'email max length is 60 characters',
  })
  readonly email: string;
}
