import { ApiProperty } from '@nestjs/swagger';

export class ContactMessageDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  read!: boolean;

  @ApiProperty()
  createdAt!: Date;
}
