import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildSearchText,
  displayName,
  firstLetter,
  Lang,
  normalizeSearch,
} from './search-text';
import {
  CreateTermDto,
  ListTermsQuery,
  RelationDto,
  UpdateTermDto,
} from './term.dto';

const TEXT_FIELDS = [
  'termRu',
  'termEn',
  'termUz',
  'definitionRu',
  'definitionEn',
  'definitionUz',
  'exampleRu',
  'exampleEn',
  'exampleUz',
] as const;
type TextFields = Record<(typeof TEXT_FIELDS)[number], string>;

const RELATED_SELECT = { id: true, termRu: true, termEn: true, termUz: true };
const COLLATOR_LOCALE: Record<Lang, string> = { ru: 'ru', en: 'en', uz: 'uz' };

@Injectable()
export class TermsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListTermsQuery) {
    const lang = query.lang ?? 'en';
    const where: Prisma.TermWhereInput = {};
    if (query.topicId) where.topicId = query.topicId;
    // Every word must appear somewhere in the entry, in any order.
    const words = normalizeSearch(query.q ?? '').split(' ').filter(Boolean);
    if (words.length) {
      where.AND = words.map((word) => ({ searchText: { contains: word } }));
    }

    const rows = await this.prisma.term.findMany({
      where,
      omit: { searchText: true },
      include: { topic: true },
    });

    // Sorted here so the order follows the reader's language, not the
    // database collation.
    const collator = new Intl.Collator(COLLATOR_LOCALE[lang]);
    const named = rows
      .map((term) => ({ term, name: displayName(term, lang) }))
      .sort((a, b) => collator.compare(a.name, b.name));

    // Letters reflect the search and topic filters but not the letter filter,
    // so the alphabet row keeps offering every letter that has results.
    const letters = [...new Set(named.map((n) => firstLetter(n.name)))];
    const letter = query.letter?.toUpperCase();
    const items = named
      .filter((n) => !letter || firstLetter(n.name) === letter)
      .map((n) => n.term);

    return { items, letters };
  }

  async findOne(id: number) {
    const term = await this.prisma.term.findUnique({
      where: { id },
      omit: { searchText: true },
      include: {
        topic: true,
        relationsFrom: { include: { to: { select: RELATED_SELECT } } },
        relationsTo: { include: { from: { select: RELATED_SELECT } } },
      },
    });
    if (!term) throw new NotFoundException('TERM_NOT_FOUND');

    const { relationsFrom, relationsTo, ...rest } = term;
    const related = [
      ...relationsFrom.map((r) => ({ type: r.type, term: r.to })),
      ...relationsTo.map((r) => ({ type: r.type, term: r.from })),
    ];
    return { ...rest, related };
  }

  async create(dto: CreateTermDto) {
    const text = this.mergeText(dto);
    const term = await this.prisma.$transaction(async (tx) => {
      const created = await tx.term.create({
        data: {
          ...text,
          searchText: buildSearchText(text),
          topicId: dto.topicId ?? null,
        },
      });
      await this.replaceRelations(tx, created.id, dto.relations ?? []);
      return created;
    });
    return this.findOne(term.id);
  }

  async update(id: number, dto: UpdateTermDto) {
    const existing = await this.prisma.term.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('TERM_NOT_FOUND');

    const text = this.mergeText(dto, existing);
    await this.prisma.$transaction(async (tx) => {
      await tx.term.update({
        where: { id },
        data: {
          ...text,
          searchText: buildSearchText(text),
          ...(dto.topicId !== undefined && { topicId: dto.topicId }),
        },
      });
      if (dto.relations) await this.replaceRelations(tx, id, dto.relations);
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const existing = await this.prisma.term.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('TERM_NOT_FOUND');
    await this.prisma.term.delete({ where: { id } });
  }

  private mergeText(dto: UpdateTermDto, existing?: TextFields): TextFields {
    const text = {} as TextFields;
    for (const field of TEXT_FIELDS) {
      text[field] = (dto[field] ?? existing?.[field] ?? '').trim();
    }
    if (!text.termRu && !text.termEn && !text.termUz) {
      throw new BadRequestException('TERM_NAME_REQUIRED');
    }
    return text;
  }

  // A pair is stored once whichever side it was added from, so all rows
  // touching the term are replaced.
  private async replaceRelations(
    tx: Prisma.TransactionClient,
    id: number,
    relations: RelationDto[],
  ) {
    const byTerm = new Map(
      relations.filter((r) => r.termId !== id).map((r) => [r.termId, r.type]),
    );
    const found = await tx.term.count({ where: { id: { in: [...byTerm.keys()] } } });
    if (found !== byTerm.size) {
      throw new BadRequestException('RELATED_TERM_NOT_FOUND');
    }

    await tx.termRelation.deleteMany({
      where: { OR: [{ fromId: id }, { toId: id }] },
    });
    for (const [toId, type] of byTerm) {
      await tx.termRelation.create({ data: { fromId: id, toId, type } });
    }
  }
}
