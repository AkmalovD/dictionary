import { PrismaClient } from '@prisma/client';
import { buildSearchText } from '../src/terms/search-text';

const prisma = new PrismaClient();

type Text = [name: string, definition: string, example?: string];
type SeedTerm = { key: string; topic: string; ru: Text; en: Text; uz: Text };

const topics = [
  { key: 'contracts', nameRu: 'Договоры и сделки', nameEn: 'Contracts and transactions', nameUz: 'Shartnomalar va bitimlar' },
  { key: 'banking', nameRu: 'Банковское дело', nameEn: 'Banking', nameUz: 'Bank ishi' },
  { key: 'takaful', nameRu: 'Такафул (страхование)', nameEn: 'Takaful (insurance)', nameUz: "Takaful (sug'urta)" },
  { key: 'capital', nameRu: 'Сукук и рынок капитала', nameEn: 'Sukuk and capital markets', nameUz: 'Sukuk va kapital bozori' },
  { key: 'principles', nameRu: 'Запреты и принципы', nameEn: 'Prohibitions and principles', nameUz: 'Taqiqlar va tamoyillar' },
  { key: 'charity', nameRu: 'Закят и благотворительность', nameEn: 'Zakat and charity', nameUz: 'Zakot va xayriya' },
];

const terms: SeedTerm[] = [
  {
    key: 'murabaha', topic: 'contracts',
    ru: ['Мурабаха', 'Договор купли-продажи, при котором продавец сообщает покупателю себестоимость товара и продаёт его с заранее оговорённой наценкой, обычно с оплатой в рассрочку.', 'Банк купил автомобиль и продал его клиенту по договору мурабаха с наценкой 10 %.'],
    en: ['Murabaha', 'A sale in which the seller discloses the cost of the goods and sells them at an agreed mark-up, usually with deferred payment.', 'The bank bought the car and sold it to the client under a murabaha with a 10% mark-up.'],
    uz: ['Murobaha', "Sotuvchi tovarning tannarxini xaridorga ma'lum qilib, uni oldindan kelishilgan ustama bilan, odatda bo'lib to'lash sharti bilan sotadigan oldi-sotdi shartnomasi.", "Bank avtomobilni sotib olib, uni mijozga murobaha shartnomasi bo'yicha 10 foiz ustama bilan sotdi."],
  },
  {
    key: 'ijara', topic: 'contracts',
    ru: ['Иджара', 'Договор аренды, по которому владелец передаёт имущество в пользование за согласованную плату, сохраняя право собственности.', 'Компания получила оборудование по договору иджара на пять лет.'],
    en: ['Ijara', 'A lease in which the owner gives the use of an asset for an agreed rent while keeping ownership.', 'The company obtained the equipment under a five-year ijara.'],
    uz: ['Ijara', 'Mulk egasi mulkka egalik huquqini saqlab qolgan holda uni kelishilgan haq evaziga foydalanishga beradigan ijara shartnomasi.', "Kompaniya uskunani besh yillik ijara shartnomasi bo'yicha oldi."],
  },
  {
    key: 'mudaraba', topic: 'contracts',
    ru: ['Мудараба', 'Партнёрство, в котором одна сторона предоставляет капитал, а другая — труд и управление. Прибыль делится в согласованной доле, финансовый убыток несёт владелец капитала.'],
    en: ['Mudaraba', 'A partnership in which one party provides capital and the other provides work and management. Profit is shared in an agreed ratio; financial loss is borne by the capital owner.'],
    uz: ['Muzoraba', "Bir tomon sarmoya, ikkinchi tomon mehnat va boshqaruvni ta'minlaydigan sheriklik. Foyda kelishilgan nisbatda bo'linadi, moliyaviy zararni sarmoya egasi ko'taradi."],
  },
  {
    key: 'musharaka', topic: 'contracts',
    ru: ['Мушарака', 'Партнёрство, в котором все стороны вносят капитал. Прибыль делится по договорённости, убытки — пропорционально вкладу каждого.'],
    en: ['Musharaka', 'A partnership in which all parties contribute capital. Profit is shared as agreed; losses are shared in proportion to each contribution.'],
    uz: ['Mushoraka', "Barcha tomonlar sarmoya kiritadigan sheriklik. Foyda kelishuvga ko'ra, zarar esa har bir tomonning ulushiga mutanosib ravishda taqsimlanadi."],
  },
  {
    key: 'salam', topic: 'contracts',
    ru: ['Салям', 'Продажа с полной предоплатой, при которой товар поставляется в оговорённый срок в будущем.'],
    en: ['Salam', 'A sale with full payment in advance for goods to be delivered at an agreed future date.'],
    uz: ['Salam', "To'lov oldindan to'liq amalga oshirilib, tovar kelajakda kelishilgan muddatda yetkazib beriladigan savdo."],
  },
  {
    key: 'istisna', topic: 'contracts',
    ru: ['Истисна', 'Договор на изготовление или строительство по заказу с согласованными ценой и характеристиками; оплата может вноситься поэтапно.'],
    en: ['Istisna', 'A contract to manufacture or build something to order at an agreed price and specification; payment may be made in stages.'],
    uz: ['Istisno', "Buyurtma asosida kelishilgan narx va tavsif bo'yicha mahsulot tayyorlash yoki qurilish shartnomasi; to'lov bosqichma-bosqich amalga oshirilishi mumkin."],
  },
  {
    key: 'wakala', topic: 'contracts',
    ru: ['Вакала', 'Агентский договор, по которому одна сторона поручает другой действовать от её имени, обычно за вознаграждение.'],
    en: ['Wakala', 'An agency contract in which one party appoints another to act on its behalf, usually for a fee.'],
    uz: ['Vakala', "Bir tomon ikkinchi tomonga o'z nomidan ish yuritishni, odatda haq evaziga, topshiradigan vakillik shartnomasi."],
  },
  {
    key: 'kafala', topic: 'contracts',
    ru: ['Кафала', 'Поручительство: обязательство третьей стороны отвечать за долг или обязательство должника.'],
    en: ['Kafala', "A guarantee: a third party's undertaking to answer for a debtor's debt or obligation."],
    uz: ['Kafolat', 'Kafillik: uchinchi tomonning qarzdorning qarzi yoki majburiyati uchun javob berish majburiyati.'],
  },
  {
    key: 'tawarruq', topic: 'contracts',
    ru: ['Таваррук', 'Получение наличных средств путём покупки товара в рассрочку и его немедленной продажи третьему лицу за наличные.'],
    en: ['Tawarruq', 'Obtaining cash by buying a commodity on deferred payment and immediately selling it to a third party for cash.'],
    uz: ['Tavarruq', "Tovarni bo'lib to'lash sharti bilan sotib olib, uni darhol uchinchi shaxsga naqd pulga sotish orqali naqd mablag' olish."],
  },
  {
    key: 'arbun', topic: 'contracts',
    ru: ['Арбун', 'Задаток, который покупатель вносит продавцу; при отказе от сделки он остаётся у продавца.'],
    en: ['Arbun', 'A down payment made by the buyer that the seller keeps if the buyer withdraws from the sale.'],
    uz: ['Arbun', 'Xaridor sotuvchiga beradigan zakalat; xaridor bitimdan voz kechsa, u sotuvchida qoladi.'],
  },
  {
    key: 'qard', topic: 'banking',
    ru: ['Кард хасан', 'Беспроцентный заём: заёмщик возвращает только сумму долга.'],
    en: ['Qard hasan', 'An interest-free loan: the borrower repays only the amount borrowed.'],
    uz: ['Qarzi hasana', 'Foizsiz qarz: qarz oluvchi faqat olingan summani qaytaradi.'],
  },
  {
    key: 'wadiah', topic: 'banking',
    ru: ['Вадиа', 'Хранение: средства или имущество передаются на сбережение и возвращаются по первому требованию.'],
    en: ['Wadiah', 'Safekeeping: money or property is deposited for custody and returned on demand.'],
    uz: ['Vadia', "Omonat saqlash: mablag' yoki mulk saqlash uchun topshiriladi va talab qilinganda qaytariladi."],
  },
  {
    key: 'rabbalmal', topic: 'banking',
    ru: ['Рабб аль-маль', 'Владелец капитала в договоре мудараба.'],
    en: ['Rabb al-mal', 'The capital provider in a mudaraba contract.'],
    uz: ['Rabbul-mol', 'Muzoraba shartnomasida sarmoya egasi.'],
  },
  {
    key: 'mudarib', topic: 'banking',
    ru: ['Мудариб', 'Управляющий в договоре мудараба, вкладывающий труд и опыт.'],
    en: ['Mudarib', 'The manager in a mudaraba contract, who contributes work and expertise.'],
    uz: ['Muzorib', "Muzoraba shartnomasida mehnati va tajribasini qo'shadigan boshqaruvchi."],
  },
  {
    key: 'window', topic: 'banking',
    ru: ['Исламское окно', 'Подразделение обычного банка, предлагающее услуги по нормам шариата с раздельным учётом средств.'],
    en: ['Islamic window', 'A unit of a conventional bank that offers Shariah-compliant services with separately kept funds.'],
    uz: ['Islomiy darcha', "An'anaviy bankning mablag'lari alohida hisobga olinadigan, shariat me'yorlariga muvofiq xizmatlar ko'rsatadigan bo'linmasi."],
  },
  {
    key: 'takaful', topic: 'takaful',
    ru: ['Такафул', 'Исламское страхование, основанное на взаимной помощи: участники вносят взносы в общий фонд, из которого покрываются убытки.', 'Семья оформила такафул для защиты дома.'],
    en: ['Takaful', 'Islamic insurance based on mutual help: participants contribute to a common fund from which losses are covered.', 'The family took out takaful to protect their home.'],
    uz: ['Takaful', "O'zaro yordamga asoslangan islomiy sug'urta: ishtirokchilar umumiy jamg'armaga badal to'laydi va zararlar shu jamg'armadan qoplanadi.", 'Oila uyini himoya qilish uchun takaful rasmiylashtirdi.'],
  },
  {
    key: 'retakaful', topic: 'takaful',
    ru: ['Ретакафул', 'Исламское перестрахование: такафул-оператор передаёт часть рисков другому оператору.'],
    en: ['Retakaful', 'Islamic reinsurance: a takaful operator passes part of its risks to another operator.'],
    uz: ['Qayta takaful', "Islomiy qayta sug'urta: takaful operatori xatarlarning bir qismini boshqa operatorga o'tkazadi."],
  },
  {
    key: 'tabarru', topic: 'takaful',
    ru: ['Табарру', 'Добровольное пожертвование; в такафуле — взнос участника в общий фонд.'],
    en: ['Tabarru', "A voluntary donation; in takaful, the participant's contribution to the common fund."],
    uz: ["Tabarru'", "Ixtiyoriy xayriya; takafulda ishtirokchining umumiy jamg'armaga to'laydigan badali."],
  },
  {
    key: 'sukuk', topic: 'capital',
    ru: ['Сукук', 'Исламские ценные бумаги, удостоверяющие долю владельца в активе или проекте и право на доход от него.'],
    en: ['Sukuk', "Islamic certificates representing the holder's share in an asset or project and a right to its income."],
    uz: ['Sukuk', "Egasining aktiv yoki loyihadagi ulushini va undan keladigan daromadga bo'lgan huquqini tasdiqlovchi islomiy qimmatli qog'ozlar."],
  },
  {
    key: 'sukukijara', topic: 'capital',
    ru: ['Сукук аль-иджара', 'Сукук, доход по которым формируется из арендных платежей за базовый актив.'],
    en: ['Sukuk al-ijara', 'Sukuk whose income comes from rent paid on the underlying asset.'],
    uz: ['Ijara sukuki', "Daromadi asosiy aktiv uchun to'lanadigan ijara to'lovlaridan shakllanadigan sukuk."],
  },
  {
    key: 'screening', topic: 'capital',
    ru: ['Шариатский скрининг', 'Отбор акций и активов по критериям шариата: вид деятельности компании и её финансовые показатели.'],
    en: ['Shariah screening', "Selecting shares and assets by Shariah criteria: the company's line of business and its financial ratios."],
    uz: ['Shariat skriningi', "Aksiya va aktivlarni shariat mezonlari — kompaniyaning faoliyat turi va moliyaviy ko'rsatkichlari bo'yicha saralash."],
  },
  {
    key: 'purification', topic: 'capital',
    ru: ['Очищение дохода', 'Передача на благотворительность той части дохода, которая получена из недозволенных источников.'],
    en: ['Purification of income', 'Giving to charity the part of income that came from impermissible sources.'],
    uz: ['Daromadni poklash', 'Daromadning ruxsat etilmagan manbalardan olingan qismini xayriyaga berish.'],
  },
  {
    key: 'riba', topic: 'principles',
    ru: ['Риба', 'Ростовщичество, процент: любая заранее оговорённая надбавка к сумме займа. Запрещена шариатом.', 'Договор не содержит риба: банк получает доход от торговли, а не от процентов.'],
    en: ['Riba', 'Usury or interest: any predetermined increase over the amount of a loan. Prohibited by Shariah.', 'The contract contains no riba: the bank earns from trade, not interest.'],
    uz: ['Ribo', "Sudxo'rlik, foiz: qarz summasi ustiga oldindan belgilangan har qanday qo'shimcha. Shariatda taqiqlangan.", "Shartnomada ribo yo'q: bank foizdan emas, savdodan daromad oladi."],
  },
  {
    key: 'gharar', topic: 'principles',
    ru: ['Гарар', 'Чрезмерная неопределённость в условиях договора: в предмете, цене или сроках.'],
    en: ['Gharar', 'Excessive uncertainty in the terms of a contract: its subject, price or timing.'],
    uz: ["G'aror", 'Shartnoma shartlaridagi — predmeti, narxi yoki muddatidagi — haddan tashqari noaniqlik.'],
  },
  {
    key: 'maysir', topic: 'principles',
    ru: ['Майсир', 'Азартная игра и сделки, в которых выигрыш зависит только от случая.'],
    en: ['Maysir', 'Gambling, and transactions in which gain depends on chance alone.'],
    uz: ['Maysir', "Qimor va yutug'i faqat tasodifga bog'liq bo'lgan bitimlar."],
  },
  {
    key: 'halal', topic: 'principles',
    ru: ['Халяль', 'Дозволенное по шариату.'],
    en: ['Halal', 'Permitted under Shariah.'],
    uz: ['Halol', "Shariat bo'yicha ruxsat etilgan."],
  },
  {
    key: 'haram', topic: 'principles',
    ru: ['Харам', 'Запрещённое по шариату.'],
    en: ['Haram', 'Forbidden under Shariah.'],
    uz: ['Harom', "Shariat bo'yicha taqiqlangan."],
  },
  {
    key: 'board', topic: 'principles',
    ru: ['Шариатский совет', 'Совет учёных, который проверяет продукты и операции финансовой организации на соответствие шариату.'],
    en: ['Shariah board', "A board of scholars that reviews a financial institution's products and operations for Shariah compliance."],
    uz: ['Shariat kengashi', 'Moliya tashkilotining mahsulot va amaliyotlari shariatga muvofiqligini tekshiradigan olimlar kengashi.'],
  },
  {
    key: 'fatwa', topic: 'principles',
    ru: ['Фетва', 'Заключение учёного или шариатского совета по конкретному вопросу.'],
    en: ['Fatwa', 'A ruling by a scholar or Shariah board on a specific question.'],
    uz: ['Fatvo', "Olim yoki shariat kengashining muayyan masala bo'yicha xulosasi."],
  },
  {
    key: 'zakat', topic: 'charity',
    ru: ['Закят', 'Обязательная ежегодная милостыня: обычно 2,5 % от имущества, превышающего установленный минимум (нисаб).', 'Он выплачивает закят со своих сбережений каждый год.'],
    en: ['Zakat', 'Obligatory annual alms: usually 2.5% of wealth above a set minimum (nisab).', 'He pays zakat on his savings every year.'],
    uz: ['Zakot', 'Majburiy yillik sadaqa: odatda belgilangan eng kam miqdordan (nisobdan) ortiq mol-mulkning 2,5 foizi.', "U har yili jamg'armalaridan zakot to'laydi."],
  },
  {
    key: 'sadaqa', topic: 'charity',
    ru: ['Садака', 'Добровольная милостыня.'],
    en: ['Sadaqa', 'Voluntary charity.'],
    uz: ['Sadaqa', 'Ixtiyoriy sadaqa, xayr-ehson.'],
  },
  {
    key: 'waqf', topic: 'charity',
    ru: ['Вакф', 'Имущество, навсегда переданное на благотворительные цели; его нельзя продать, а доход идёт на общественные нужды.'],
    en: ['Waqf', 'Property permanently dedicated to charitable purposes; it cannot be sold, and its income serves public needs.'],
    uz: ['Vaqf', "Xayriya maqsadlariga abadiy ajratilgan mulk; uni sotib bo'lmaydi, daromadi esa jamoat ehtiyojlariga sarflanadi."],
  },
];

const relations: [from: string, to: string, type: string][] = [
  ['murabaha', 'tawarruq', 'SEE_ALSO'],
  ['mudaraba', 'musharaka', 'SEE_ALSO'],
  ['mudaraba', 'mudarib', 'SEE_ALSO'],
  ['mudaraba', 'rabbalmal', 'SEE_ALSO'],
  ['mudarib', 'rabbalmal', 'SEE_ALSO'],
  ['salam', 'istisna', 'SEE_ALSO'],
  ['ijara', 'sukukijara', 'SEE_ALSO'],
  ['sukuk', 'sukukijara', 'SEE_ALSO'],
  ['takaful', 'retakaful', 'SEE_ALSO'],
  ['takaful', 'tabarru', 'SEE_ALSO'],
  ['riba', 'qard', 'SEE_ALSO'],
  ['riba', 'haram', 'SEE_ALSO'],
  ['gharar', 'maysir', 'SEE_ALSO'],
  ['halal', 'haram', 'ANTONYM'],
  ['board', 'fatwa', 'SEE_ALSO'],
  ['screening', 'purification', 'SEE_ALSO'],
  ['zakat', 'sadaqa', 'SEE_ALSO'],
  ['sadaqa', 'waqf', 'SEE_ALSO'],
];

async function main() {
  if ((await prisma.term.count()) > 0 || (await prisma.topic.count()) > 0) {
    console.log('Database already has data, seed skipped.');
    return;
  }

  const topicIds = new Map<string, number>();
  for (const [index, { key, ...names }] of topics.entries()) {
    const topic = await prisma.topic.create({ data: { ...names, sortOrder: index } });
    topicIds.set(key, topic.id);
  }

  const termIds = new Map<string, number>();
  for (const { key, topic, ru, en, uz } of terms) {
    const text = {
      termRu: ru[0], definitionRu: ru[1], exampleRu: ru[2] ?? '',
      termEn: en[0], definitionEn: en[1], exampleEn: en[2] ?? '',
      termUz: uz[0], definitionUz: uz[1], exampleUz: uz[2] ?? '',
    };
    const created = await prisma.term.create({
      data: { ...text, searchText: buildSearchText(text), topicId: topicIds.get(topic) },
    });
    termIds.set(key, created.id);
  }

  for (const [from, to, type] of relations) {
    await prisma.termRelation.create({
      data: { fromId: termIds.get(from)!, toId: termIds.get(to)!, type },
    });
  }

  console.log(`Seeded ${topics.length} topics and ${terms.length} terms.`);
}

main().finally(() => prisma.$disconnect());
