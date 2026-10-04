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
} from '@nestjs/common';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topics: TopicsService) {}

  @Get()
  findAll() {
    return this.topics.findAll();
  }

  @Post()
  create(@Body() dto: CreateTopicDto) {
    return this.topics.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTopicDto) {
    return this.topics.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topics.remove(id);
  }
}
