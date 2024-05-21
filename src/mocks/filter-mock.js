import { filtersGenerateInfo } from '../utils.js';

function generateFilter(points) {
  return Object.entries(filtersGenerateInfo).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      count: filterPoints(points).length,
    }),
  );
}

export {generateFilter};
