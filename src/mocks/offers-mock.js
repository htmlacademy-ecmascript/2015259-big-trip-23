import { POINT_TYPES } from '../const.js';

const mockOffers = [
  {
    type: `${POINT_TYPES[0]}`,
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e111314baa31',
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e221314baa31',
        title: 'Meeting with a sign',
        price: 20
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e331314baa31',
        title: 'Another offer',
        price: 70
      }
    ]
  },
  {
    type: `${POINT_TYPES[5]}`,
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e441314baa31',
        title: 'Add luggage',
        price: 30
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e551314baa31',
        title: 'Meeting with a sign',
        price: 20
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e661314baa31',
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e771314baa31',
        title: 'Switch to comfort class',
        price: 80
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e881314baa31',
        title: 'Add meal',
        price: 20
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e991314baa31',
        title: 'Choose seats',
        price: 10
      }
    ]
  },
  {
    type: `${POINT_TYPES[3]}`,
    offers: [
      {
        id: 'b4c3e4a6-9053-42ce-b747-e551314baa31',
        title: 'Add alco free',
        price: 1200
      },
      {
        id: 'b4c3e4b6-9053-42ce-b747-e551314baa31',
        title: 'GYM',
        price: 100
      },
      {
        id: 'b4c3e4c6-9053-42ce-b747-e551314baa31',
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 'b4c3e4d6-9053-42ce-b747-e551314baa31',
        title: 'Upgrade to a comfort class',
        price: 80
      },
      {
        id: 'b4c3e4e7-9053-42ce-b747-e551314baa31',
        title: 'Suit with window',
        price: 250
      },
    ]
  },
  {
    type: `${POINT_TYPES[2]}`,
    offers: []
  },
];

export {mockOffers};
