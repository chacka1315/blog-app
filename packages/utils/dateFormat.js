import { format } from 'date-fns';

export function formatPostDate(date) {
  return format(date, 'PP');
}

export function formatCommentDate(date) {
  const dt = format(date, 'PP');
  const time = format(date, 'p').split(' ')[0];
  return `${dt} ${time}`;
}
