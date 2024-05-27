import dayjs from 'dayjs';
import { calculateDurationOfStay } from './utils.js';

function sortPointsByDay(firstPoint, secondPoint) {
  return dayjs(firstPoint.dateFrom) - dayjs(secondPoint.dateFrom);
}

function sortPointsByTime(firstPoint, secondPoint) {
  return calculateDurationOfStay(secondPoint.dateTo, secondPoint.dateFrom).$ms - calculateDurationOfStay(firstPoint.dateTo, firstPoint.dateFrom).$ms;
}

function sortPointsByPrice(firstPoint, secondPoint) {
  return Number(secondPoint.basePrice) - Number(firstPoint.basePrice);
}

export {
  sortPointsByTime,
  sortPointsByPrice,
  sortPointsByDay,
};
