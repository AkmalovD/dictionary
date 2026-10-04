import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const topics = await this.prisma.topic.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: { _count: { select: { terms: true } } },
    });
    return topics.map(({ _count, ...topic }) => ({
      ...topic,
      termCount: _count.terms,
    }));
  }

  create(dto: CreateTopicDto) {
    return this.prisma.topic.create({ data: dto });
  }

  async update(id: number, dto: UpdateTopicDto) {
    await this.ensureExists(id);
    return this.prisma.topic.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    const termCount = await this.prisma.term.count({ where: { topicId: id } });
    if (termCount > 0) {
      throw new ConflictException('TOPIC_IN_USE');
    }
    await this.prisma.topic.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) throw new NotFoundException('TOPIC_NOT_FOUND');
  }
}
