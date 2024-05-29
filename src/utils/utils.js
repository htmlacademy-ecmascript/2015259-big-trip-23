import dayjs from 'dayjs';
import { DateFormat } from '../const.js';
import { nanoid } from 'nanoid';

const getRandomArrayElement = (arr) => {
  const item = arr[Math.floor(Math.random() * arr.length)];
  return { ...item, id: nanoid() };
};

const transformDate = (str) => str[0]?.toUpperCase() + str?.slice(1);
const formatDateInForm = (date, format) => date ? dayjs(date).format(format) : '';
const isDatesSame = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const transformToDateFromFormat = (dateFrom) => formatDateInForm(dateFrom, DateFormat.DATE);
const transformToTimeFromFormat = (dateFrom) => formatDateInForm(dateFrom, DateFormat.TIME);
const transformToTimeToFormat = (date) => formatDateInForm(date, DateFormat.TIME);
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
