import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessageDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
