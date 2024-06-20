const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SORTS = ['day', 'event', 'time', 'price', 'offers'];

const VALID_DATA_LENGTH = 2;
const AUTHORIZATION = 'Basic k3u5b8v9h2g6z1x0';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

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
  type: POINT_TYPES[5],
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
  everything: 'Click New Event to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future: 'There are no future events now',
};

const ModeType = {
  VIEWING: 'VIEWING',
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
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  POINT_TYPES,
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
  VALID_DATA_LENGTH,
  AUTHORIZATION,
  END_POINT,
  TimeLimit,
};
