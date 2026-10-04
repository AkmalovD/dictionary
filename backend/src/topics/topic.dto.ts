import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nameRu: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nameUz: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
