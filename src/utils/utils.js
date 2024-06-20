import dayjs from 'dayjs';
import { DateFormat, VALID_DATA_LENGTH } from '../const.js';

const capitalizeFirstLetter = (word) => word[0]?.toUpperCase() + word?.slice(1);
const formatDateInForm = (date, format) => date ? dayjs(date).format(format) : '';
const isDatesSame = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const transformToTimeToFormatReverse = (date) => formatDateInForm(date, DateFormat.REVERSE_DATE);
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
  capitalizeFirstLetter,
  formatDateInForm,
  transformToDateFromFormat,
  transformToTimeToFormat,
  calculateDurationOfStay,
  isDatesSame,
  formatDurationToTwoCharacters,
  transformToTimeToFormatReverse
};
