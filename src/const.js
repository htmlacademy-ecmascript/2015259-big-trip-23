const CITIES = ['Limassol', 'Hague', 'Geneva', 'Berlin', 'Stockholm'];
const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SORTS = ['day', 'event', 'time', 'price', 'offers'];
const POINTS_COUNT = 3;
const VALID_DATA_LENGTH = 2;

const DateFormat = {
  DATE: 'MMM DD',
  REVERSE_DATE: 'D MMM',
  TIME: 'HH:mm',
  FULL: 'DD/MM/YY'
};

const NEW_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: POINT_TYPES[3]
};

const RenderPosition = {
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
  CREATE_NEW: 'CREATE_NEW',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  CITIES,
  POINT_TYPES,
  POINTS_COUNT,
  DateFormat,
  FilterType,
  SORTS,
  RenderPosition,
  EmptyFiltersList,
  ModeType,
  SortType,
  UserAction,
  UpdateType,
  NEW_POINT,
  VALID_DATA_LENGTH
};
