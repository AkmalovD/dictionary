import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/configure-app';

describe('Dictionary API', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request>;
  let topicId: number;
  let ribaId: number;
  let qardId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    http = request(app.getHttpServer());
  });

  afterAll(() => app.close());

  const names = (res: request.Response) =>
    res.body.items.map((t: { termEn: string }) => t.termEn);

  it('creates a topic and terms', async () => {
    const topic = await http
      .post('/api/topics')
      .send({ nameRu: 'Принципы', nameEn: 'Principles', nameUz: 'Tamoyillar' })
      .expect(201);
    topicId = topic.body.id;

    const riba = await http
      .post('/api/terms')
      .send({ termRu: 'Риба', termEn: 'Riba', termUz: 'Ribo', definitionRu: 'Процент по займу', topicId })
      .expect(201);
    ribaId = riba.body.id;

    const qard = await http
      .post('/api/terms')
      .send({ termRu: 'Кард хасан', termEn: 'Qard hasan', termUz: 'Qarzi hasana' })
      .expect(201);
    qardId = qard.body.id;

    await http
      .post('/api/terms')
      .send({ termRu: 'Гарар', termEn: 'Gharar', termUz: 'G‘aror', topicId })
      .expect(201);
  });

  it('rejects a term with no name in any language', async () => {
    await http.post('/api/terms').send({ definitionEn: 'Nameless' }).expect(400);
    await http.post('/api/terms').send({ termEn: '   ' }).expect(400);
  });

  it('finds Cyrillic terms regardless of case', async () => {
    for (const q of ['риба', 'РИБА', 'Риба']) {
      const res = await http.get('/api/terms').query({ q }).expect(200);
      expect(names(res)).toEqual(['Riba']);
    }
  });

  it('searches inside definitions', async () => {
    const res = await http.get('/api/terms').query({ q: 'ЗАЙМУ' }).expect(200);
    expect(names(res)).toEqual(['Riba']);
  });

  it('treats Uzbek apostrophe variants as the same', async () => {
    for (const q of ["g'aror", 'g‘aror', 'g’aror', 'gʻaror']) {
      const res = await http.get('/api/terms').query({ q }).expect(200);
      expect(names(res)).toEqual(['Gharar']);
    }
  });

  it('filters by topic and by first letter, sorted in the chosen language', async () => {
    const byTopic = await http.get('/api/terms').query({ topicId, lang: 'en' }).expect(200);
    expect(names(byTopic)).toEqual(['Gharar', 'Riba']);

    const all = await http.get('/api/terms').query({ lang: 'ru' }).expect(200);
    expect(names(all)).toEqual(['Gharar', 'Qard hasan', 'Riba']);
    expect(all.body.letters).toEqual(['Г', 'К', 'Р']);

    const byLetter = await http.get('/api/terms').query({ lang: 'ru', letter: 'к' }).expect(200);
    expect(names(byLetter)).toEqual(['Qard hasan']);
    expect(byLetter.body.letters).toEqual(['Г', 'К', 'Р']);
  });

  it('shows a relation from both sides and replaces it on update', async () => {
    await http
      .patch(`/api/terms/${ribaId}`)
      .send({ relations: [{ termId: qardId, type: 'SEE_ALSO' }] })
      .expect(200);

    const riba = await http.get(`/api/terms/${ribaId}`).expect(200);
    expect(riba.body.related).toEqual([
      { type: 'SEE_ALSO', term: expect.objectContaining({ id: qardId }) },
    ]);
    const qard = await http.get(`/api/terms/${qardId}`).expect(200);
    expect(qard.body.related).toEqual([
      { type: 'SEE_ALSO', term: expect.objectContaining({ id: ribaId }) },
    ]);

    // Saving from the other side must not duplicate the pair.
    await http
      .patch(`/api/terms/${qardId}`)
      .send({ relations: [{ termId: ribaId, type: 'ANTONYM' }] })
      .expect(200);
    const after = await http.get(`/api/terms/${ribaId}`).expect(200);
    expect(after.body.related).toEqual([
      { type: 'ANTONYM', term: expect.objectContaining({ id: qardId }) },
    ]);
  });

  it('rejects relations to missing terms and keeps names on partial update', async () => {
    await http
      .patch(`/api/terms/${ribaId}`)
      .send({ relations: [{ termId: 99999, type: 'SEE_ALSO' }] })
      .expect(400);

    const res = await http
      .patch(`/api/terms/${ribaId}`)
      .send({ definitionEn: 'Interest on a loan' })
      .expect(200);
    expect(res.body.termRu).toBe('Риба');
    const found = await http.get('/api/terms').query({ q: 'interest' }).expect(200);
    expect(names(found)).toEqual(['Riba']);
  });

  it('refuses to delete a topic that still has terms', async () => {
    await http.delete(`/api/topics/${topicId}`).expect(409);
  });

  it('deletes a term together with its relations', async () => {
    await http.delete(`/api/terms/${qardId}`).expect(204);
    await http.get(`/api/terms/${qardId}`).expect(404);
    const riba = await http.get(`/api/terms/${ribaId}`).expect(200);
    expect(riba.body.related).toEqual([]);
  });
});
