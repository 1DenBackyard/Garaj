export type ServiceCategory =
  | 'Двигатель/впуск'
  | 'Масла и жидкости'
  | 'Трансмиссия'
  | 'Тормоза'
  | 'Подвеска/рулевое'
  | 'Прочее';

export type ServiceItem = {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number | [number, number];
  unit?: string;
  note?: string;
};

export const categories: ServiceCategory[] = [
  'Двигатель/впуск',
  'Масла и жидкости',
  'Трансмиссия',
  'Тормоза',
  'Подвеска/рулевое',
  'Прочее'
];

export const services: ServiceItem[] = [
  { id: 'clean-intake-4', name: 'Чистка впуска 4 цилиндра', category: 'Двигатель/впуск', price: 25000 },
  { id: 'clean-intake-6', name: 'Чистка впуска 6 цилиндров', category: 'Двигатель/впуск', price: 30000 },
  { id: 'engine-mounts', name: 'Замена подушек ДВС', category: 'Двигатель/впуск', price: 15000 },
  { id: 'replace-damper', name: 'Замена демпфера', category: 'Двигатель/впуск', price: 7000 },
  { id: 'gearbox-oil', name: 'Замена масла в коробке', category: 'Трансмиссия', price: 6000 },
  {
    id: 'front-diff-oil',
    name: 'Замена масла в переднем редукторе',
    category: 'Трансмиссия',
    price: 2500
  },
  {
    id: 'transfer-case-oil',
    name: 'Замена масла в раздатке',
    category: 'Трансмиссия',
    price: 3500,
    note: 'в стоимость входит сброс адаптаций'
  },
  { id: 'rear-diff-oil', name: 'Замена масла в заднем редукторе', category: 'Трансмиссия', price: 2000 },
  { id: 'engine-oil', name: 'Замена масла в ДВС', category: 'Масла и жидкости', price: 1500 },
  {
    id: 'cabin-filter',
    name: 'Замена салонного фильтра',
    category: 'Масла и жидкости',
    price: [1000, 1500],
    note: 'зависит от авто'
  },
  {
    id: 'air-filter',
    name: 'Замена воздушного фильтра',
    category: 'Масла и жидкости',
    price: [800, 1000],
    note: 'зависит от авто'
  },
  {
    id: 'oil-filter-housing',
    name: 'Замена масляного стакана',
    category: 'Двигатель/впуск',
    price: [7000, 15000]
  },
  { id: 'valve-cover', name: 'Замена клапанной крышки', category: 'Двигатель/впуск', price: 15000 },
  {
    id: 'drive-shaft-boot',
    name: 'Замена/с-у привода или пыльника (если позволяет технология)',
    category: 'Трансмиссия',
    price: 12000
  },
  {
    id: 'rear-diff-seals',
    name: 'Замена сальников заднего редуктора',
    category: 'Трансмиссия',
    price: 13000
  },
  {
    id: 'rear-diff-coupling',
    name: 'Замена муфты заднего редуктора',
    category: 'Трансмиссия',
    price: 8000
  },
  {
    id: 'radiator-cleaning',
    name: 'Мойка радиаторов',
    category: 'Прочее',
    price: [12000, 32000],
    note: 'только работа, жидкости отдельно; для Porsche обычно 32000'
  },
  { id: 'brake-pads', name: 'Замена колодок', category: 'Тормоза', price: 2500, unit: 'за ось' },
  {
    id: 'brake-discs',
    name: 'Замена тормозных дисков',
    category: 'Тормоза',
    price: 2500,
    unit: 'за ось'
  },
  {
    id: 'rear-ball-joints',
    name: 'Смазка задних шаровых (BMW G кузов, от 3 до X7)',
    category: 'Подвеска/рулевое',
    price: 6000,
    note: 'от скрипов'
  },
  {
    id: 'lower-transverse-arm',
    name: 'Замена рычага нижнего поперечного',
    category: 'Подвеска/рулевое',
    price: 3500,
    unit: 'за одну'
  },
  {
    id: 'longitudinal-link',
    name: 'Замена продольной тяги',
    category: 'Подвеска/рулевое',
    price: 3500,
    unit: 'за одну'
  },
  {
    id: 'front-silent-blocks',
    name: 'Замена сайлентблоков передних продольных тяг',
    category: 'Подвеска/рулевое',
    price: 4500,
    unit: 'за одну',
    note: 'часто выгоднее заменить тягу целиком'
  },
  {
    id: 'steering-rods',
    name: 'Разработка и смазка рулевых тяг для регулировки УУК',
    category: 'Подвеска/рулевое',
    price: 4000,
    note: 'если получится раскрутить'
  },
  {
    id: 'brake-fluid',
    name: 'Замена тормозной жидкости',
    category: 'Масла и жидкости',
    price: 2500,
    note: 'жидкость отдельно'
  }
];

export function formatPrice(price: ServiceItem['price']): string {
  const format = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

  if (Array.isArray(price)) {
    return `${format(price[0])}–${format(price[1])} ₽`;
  }

  return `${format(price)} ₽`;
}
