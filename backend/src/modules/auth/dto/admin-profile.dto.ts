import { ApiProperty } from '@nestjs/swagger';

export class AdminProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;
}
