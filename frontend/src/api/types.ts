export type Lang = 'ru' | 'en' | 'uz';
export type RelationType = 'SEE_ALSO' | 'SYNONYM' | 'ANTONYM';
export const RELATION_TYPES: RelationType[] = ['SEE_ALSO', 'SYNONYM', 'ANTONYM'];

export interface Topic {
  id: number;
  nameRu: string;
  nameEn: string;
  nameUz: string;
  sortOrder: number;
  termCount?: number;
}

export interface TermNames {
  id: number;
  termRu: string;
  termEn: string;
  termUz: string;
}

export interface TermText {
  termRu: string;
  termEn: string;
  termUz: string;
  definitionRu: string;
  definitionEn: string;
  definitionUz: string;
  exampleRu: string;
  exampleEn: string;
  exampleUz: string;
}

export interface Term extends TermText {
  id: number;
  topicId: number | null;
  topic: Topic | null;
}

export interface TermDetail extends Term {
  related: { type: RelationType; term: TermNames }[];
}

export interface TermList {
  items: Term[];
  letters: string[];
}

export interface TermInput extends TermText {
  topicId: number | null;
  relations: { termId: number; type: RelationType }[];
}

export type TopicInput = Pick<Topic, 'nameRu' | 'nameEn' | 'nameUz'>;

export interface TermFilters {
  q?: string;
  topicId?: string;
  lang: Lang;
}
