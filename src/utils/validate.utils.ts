import moment from 'moment';

export function isValidDate(dateString: string | undefined) {
  return moment(dateString, process.env.DATE_PATTERN, true).isValid();
}
