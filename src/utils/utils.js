import dayjs from 'dayjs';
import { DateFormat, VALID_DATA_LENGTH } from '../const.js';
import { nanoid } from 'nanoid';

const getRandomArrayElement = (arr) => {
  const item = arr[Math.floor(Math.random() * arr.length)];
  return { ...item, id: nanoid() };
};

const capitalizeFirstLetter = (str) => str[0]?.toUpperCase() + str?.slice(1);
const formatDateInForm = (date, format) => date ? dayjs(date).format(format) : '';
const isDatesSame = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const transformToDateFromFormat = (dateFrom) => formatDateInForm(dateFrom, DateFormat.DATE);
const transformToTimeToFormat = (date) => formatDateInForm(date, DateFormat.TIME);
const calculateDurationOfStay = (dateTo, dateFrom) => dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
const formatDurationToTwoCharacters = (durationElement) => {
  const isTwoCharacters = String(durationElement).length < VALID_DATA_LENGTH;
  if (isTwoCharacters) {
    return `0${durationElement}`;
  } else {
    return durationElement;
  }
};

export {
  getRandomArrayElement,
  capitalizeFirstLetter,
  formatDateInForm,
  transformToDateFromFormat,
  transformToTimeToFormat,
  calculateDurationOfStay,
  isDatesSame,
  formatDurationToTwoCharacters
};
