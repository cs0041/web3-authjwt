import { IsNotEmpty, IsString } from 'class-validator';

export class LoginVerifyDto {
  @IsNotEmpty()
  @IsString()
  signature: string;
}
