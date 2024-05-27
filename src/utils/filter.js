import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { FilterType } from '../const.js';

dayjs.extend(isBetween);

const checkIsPointBefore = (date) => dayjs(date).isBefore(dayjs(), 'D');
const checkIsPointAfter = (date) => dayjs(date).isAfter(dayjs(), 'D');
const checkIsPointRange = (point) => {
  const { dateFrom, dateTo } = point;
  return dayjs().isBetween(dayjs(dateTo), dayjs(dateFrom), 'D');
};


const filtersGenerateInfo = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points?.filter((point) => checkIsPointAfter(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points?.filter((point) => checkIsPointRange(point)),
  [FilterType.PAST]: (points) => points?.filter((point) => checkIsPointBefore(point.dateTo)),
};

function generateFilter(points) {
  return Object.entries(filtersGenerateInfo).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      count: filterPoints(points).length,
    }),
  );
}

function filterByFuture(points) {
  return points.filter((point) => checkIsPointAfter(point?.dateFrom));
}

function filterByPast(points) {
  return points.filter((point) => checkIsPointBefore(point?.dateTo));
}

function filterByPresent(points) {
  return points.filter((point) => checkIsPointRange(point));
}

export {
  generateFilter,
  filterByFuture,
  filterByPast,
  filterByPresent
};
