import dayjs from 'dayjs';


export const getRandomArrayElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const transformDate = (str) => str[0]?.toUpperCase() + str?.slice(1);
export const formatDateInForm = (date, format) => date ? dayjs(date).format(format) : '';
