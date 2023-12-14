import moment from 'moment';

export const isDateAfter = (dateA: string, dateB: string) => moment(dateA).isSameOrAfter(dateB);