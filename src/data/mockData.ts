import type { Job, PartItem, ClientData } from '../types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1', bay: 'БОКС 01 — ПОДЪЁМНИК', timeStart: '08:30', timeEnd: '10:00',
    service: 'ЗАМЕНА МАСЛА И ФИЛЬТРА', vehicle: 'KIA SORENTO', vehicleYear: 2019,
    client: 'А. ИВАНОВ', status: 'in_progress', isDelayed: false,
  },
  {
    id: '2', bay: 'БОКС 01 — ПОДЪЁМНИК', timeStart: '10:30', timeEnd: '12:00',
    service: 'ЗАМЕНА ТОРМОЗНЫХ КОЛОДОК', vehicle: 'TOYOTA HILUX', vehicleYear: 2021,
    client: 'М. ПЕТРОВ', status: 'in_progress', isDelayed: true, delayReason: 'ОЖИДАНИЕ ЗАПЧАСТЕЙ',
  },
  {
    id: '3', bay: 'БОКС 01 — ПОДЪЁМНИК', timeStart: '13:00', timeEnd: '14:30',
    service: 'ДИАГНОСТИКА ХОДОВОЙ', vehicle: 'HYUNDAI SOLARIS', vehicleYear: 2020,
    client: 'Е. СИДОРОВА', status: 'waiting', isDelayed: false,
  },
  {
    id: '4', bay: 'БОКС 02 — ДИАГНОСТИКА', timeStart: '09:00', timeEnd: '11:00',
    service: 'КОМПЬЮТЕРНАЯ ДИАГНОСТИКА', vehicle: 'BMW X5', vehicleYear: 2018,
    client: 'Д. КОЗЛОВ', status: 'diagnostics', isDelayed: false,
  },
  {
    id: '5', bay: 'БОКС 02 — ДИАГНОСТИКА', timeStart: '11:30', timeEnd: '13:00',
    service: 'ЗАМЕНА СВЕЧЕЙ ЗАЖИГАНИЯ', vehicle: 'FORD MUSTANG', vehicleYear: 2020,
    client: 'И. ВОЛКОВ', status: 'ready', isDelayed: false,
  },
];

export const MOCK_PARTS: PartItem[] = [
  { id: '1', name: 'Castrol Edge 5W-30 Full Synthetic', sku: 'FL-8392', qty: 24, category: 'Масла', location: 'Стеллаж 4, Полка B', isLowStock: false },
  { id: '2', name: 'Тормозные колодки TRW (передние)', sku: 'BRK-C-774', qty: 3, category: 'Тормоза', location: 'Стеллаж 2, Полка A', isLowStock: true },
  { id: '3', name: 'Фильтр масляный MANN W 712/95', sku: 'FLT-O-992', qty: 0, category: 'Фильтры', location: '-', isLowStock: true },
  { id: '4', name: 'Свечи зажигания NGK BKR6EIX (x4)', sku: 'SPK-N-441', qty: 12, category: 'Электрика', location: 'Стеллаж 1, Полка C', isLowStock: false },
  { id: '5', name: 'Антифриз Coolstream G12+ 5L', sku: 'CLN-CS-50', qty: 8, category: 'Масла', location: 'Стеллаж 4, Полка D', isLowStock: false },
  { id: '6', name: 'Фильтр воздушный BOSCH S0181', sku: 'FLT-A-181', qty: 6, category: 'Фильтры', location: 'Стеллаж 3, Полка A', isLowStock: false },
  { id: '7', name: 'Тормозной диск BREMBO 09.A820.11', sku: 'BRK-D-820', qty: 2, category: 'Тормоза', location: 'Стеллаж 2, Полка C', isLowStock: true },
  { id: '8', name: 'Аккумулятор VARTA Blue 60Ah', sku: 'ELC-V-060', qty: 4, category: 'Электрика', location: 'Стеллаж 5, Полка A', isLowStock: false },
];

export const MOCK_CLIENTS: ClientData[] = [
  {
    id: '1', name: 'АЛЕКСЕЙ ИВАНОВ', phone: '+7 978 123-45-67', visits: 12, isVip: true,
    vehicles: [
      { make: 'KIA SORENTO / 2019', year: 2019, vin: 'XWEPH81ABK0012345', plate: 'А 123 АА 82', inShop: true },
      { make: 'TOYOTA CAMRY / 2015', year: 2015, vin: '4T1BF1FK8FUXXXXX', plate: 'В 456 ВВ 82', inShop: false },
    ],
  },
  {
    id: '2', name: 'МАРИЯ ПЕТРОВА', phone: '+7 978 234-56-78', visits: 5, isVip: false,
    vehicles: [
      { make: 'HYUNDAI SOLARIS / 2020', year: 2020, vin: 'Z94CT41DBMR123456', plate: 'С 789 СС 82', inShop: false },
    ],
  },
  {
    id: '3', name: 'ДМИТРИЙ КОЗЛОВ', phone: '+7 978 345-67-89', visits: 8, isVip: true,
    vehicles: [
      { make: 'BMW X5 / 2018', year: 2018, vin: 'WBAKR210X0L123456', plate: 'Е 012 ЕЕ 82', inShop: true },
      { make: 'ЛАДА VESTA / 2022', year: 2022, vin: 'XTAGFK130NY123456', plate: 'К 345 КК 82', inShop: false },
    ],
  },
  {
    id: '4', name: 'ЕЛЕНА СИДОРОВА', phone: '+7 978 456-78-90', visits: 3, isVip: false,
    vehicles: [
      { make: 'VOLKSWAGEN POLO / 2021', year: 2021, vin: 'XWFEA41B2PY123456', plate: 'М 678 МН 82', inShop: false },
    ],
  },
  {
    id: '5', name: 'ИГОРЬ ВОЛКОВ', phone: '+7 978 567-89-01', visits: 15, isVip: true,
    vehicles: [
      { make: 'FORD MUSTANG / 2020', year: 2020, vin: '1FA6P8CF5L5123456', plate: 'О 901 ОР 82', inShop: true },
    ],
  },
];

export const PART_CATEGORIES = ['ВСЕ', 'МАСЛА', 'ФИЛЬТРЫ', 'ТОРМОЗА', 'ЭЛЕКТРИКА'];
