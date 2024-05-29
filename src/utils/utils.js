import dayjs from 'dayjs';
import { DATE_FORMAT, TIME_FORMAT } from '../const.js';
import { nanoid } from 'nanoid';

const getRandomArrayElement = (arr) => {
  const item = arr[Math.floor(Math.random() * arr.length)];
  return { ...item, id: nanoid() };
};

const transformDate = (str) => str[0]?.toUpperCase() + str?.slice(1);
const formatDateInForm = (date, format) => date ? dayjs(date).format(format) : '';
const isDatesSame = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const transformToDateFromFormat = (dateFrom) => formatDateInForm(dateFrom, DATE_FORMAT);
const transformToTimeFromFormat = (dateFrom) => formatDateInForm(dateFrom, TIME_FORMAT);
const transformToTimeToFormat = (date) => formatDateInForm(date, TIME_FORMAT);
const calculateDurationOfStay = (dateTo, dateFrom) => dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

export {
  getRandomArrayElement,
  transformDate,
  formatDateInForm,
  transformToDateFromFormat,
  transformToTimeFromFormat,
  transformToTimeToFormat,
  calculateDurationOfStay,
  isDatesSame
};
