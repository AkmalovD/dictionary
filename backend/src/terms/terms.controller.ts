import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTermDto, ListTermsQuery, UpdateTermDto } from './term.dto';
import { TermsService } from './terms.service';

@Controller('terms')
export class TermsController {
  constructor(private readonly terms: TermsService) {}

  @Get()
  findAll(@Query() query: ListTermsQuery) {
    return this.terms.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.terms.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTermDto) {
    return this.terms.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTermDto) {
    return this.terms.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.terms.remove(id);
  }
}
