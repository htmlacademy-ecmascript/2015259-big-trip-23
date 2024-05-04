import { getRandomArrayElement } from '../utils.js';

const mockPoints = [
  {
    id: 'f4b62099-293f-4c3d-a702-44eec4a2808c',
    basePrice: 200,
    dateFrom: '2023-07-10T22:55:56.845Z',
    dateTo: '2023-07-11T11:22:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a66c-0e528e910e04',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e111314baa31',
      'b4c3e4e6-9053-42ce-b747-e221314baa31',
      'b4c3e4e6-9053-42ce-b747-e331314baa31'
    ],
    type: 'taxi'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-55eec4a2808c',
    basePrice: 1100,
    dateFrom: '2023-08-10T22:55:56.845Z',
    dateTo: '2023-08-11T00:12:11.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a77c-0e528e910e04',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e441314baa31',
      'b4c3e4e6-9053-42ce-b747-e551314baa31'
    ],
    type: 'flight'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-66eec4a2808c',
    basePrice: 2000,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-15T15:22:43.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a55c-0e528e910e04',
    isFavorite: true,
    offers: [],
    type: 'ship'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-77eec4a2808c',
    basePrice: 1100,
    dateFrom: '2019-07-11T11:22:13.375Z',
    dateTo: '2019-07-12T17:50:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a78c-0e528e910e04',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e991314baa31'
    ],
    type: 'bus'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-88eec4a2808c',
    basePrice: 1100,
    dateFrom: '2024-01-10T08:39:04.116Z',
    dateTo: '2024-01-11T08:14:04.116Z',
    destination: 'bfa5cb75-a1fe-4b77-a44c-0e528e910e04',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e111314baa31',
    ],
    type: 'taxi'
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export { getRandomPoint };
