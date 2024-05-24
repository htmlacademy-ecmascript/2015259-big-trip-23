const CITIES = ['Limassol', 'Hague', 'Geneva', 'Berlin', 'Stockholm'];
const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SORTS = ['day', 'event', 'time', 'price', 'offers'];
const POINTS_COUNT = 3;

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_FORMAT = 'DD/MM/YY';
const RENDER_POSITION = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
const EmptyFiltersList = {
  everything: 'Click "New Event" to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future: 'There are no future events now',
};

const ModeType = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export {
  CITIES,
  POINT_TYPES,
  POINTS_COUNT,
  DATE_FORMAT,
  FilterType,
  SORTS,
  TIME_FORMAT,
  FULL_DATE_FORMAT,
  RENDER_POSITION,
  EmptyFiltersList,
  ModeType,
  SortType
};
