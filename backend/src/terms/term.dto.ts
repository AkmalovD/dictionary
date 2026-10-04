import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { LANGS, Lang } from './search-text';

export const RELATION_TYPES = ['SEE_ALSO', 'SYNONYM', 'ANTONYM'] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

export class RelationDto {
  @IsInt()
  termId: number;

  @IsIn(RELATION_TYPES)
  type: RelationType;
}

export class CreateTermDto {
  @IsOptional() @IsString() @MaxLength(200)
  termRu?: string;

  @IsOptional() @IsString() @MaxLength(200)
  termEn?: string;

  @IsOptional() @IsString() @MaxLength(200)
  termUz?: string;

  @IsOptional() @IsString() @MaxLength(4000)
  definitionRu?: string;

  @IsOptional() @IsString() @MaxLength(4000)
  definitionEn?: string;

  @IsOptional() @IsString() @MaxLength(4000)
  definitionUz?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  exampleRu?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  exampleEn?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  exampleUz?: string;

  @IsOptional() @IsInt()
  topicId?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelationDto)
  relations?: RelationDto[];
}

export class UpdateTermDto extends PartialType(CreateTermDto) {}

export class ListTermsQuery {
  @IsOptional() @IsString() @MaxLength(200)
  q?: string;

  @IsOptional() @Type(() => Number) @IsInt()
  topicId?: number;

  @IsOptional() @IsString() @MaxLength(1)
  letter?: string;

  @IsOptional() @IsIn(LANGS)
  lang?: Lang;
}
