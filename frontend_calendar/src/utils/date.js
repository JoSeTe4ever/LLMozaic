import { DateTime } from 'luxon';

const get12HourTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

const getNextHalfHour = () => {
  const date = new Date();
  const currentMinutes = date.getMinutes();
  const minutesToAdd = 30 - (currentMinutes % 30 || 0);

  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date;
};

const getOneHourFromPassedTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  date.setHours(timestamp.getHours() + 1);

  return date;
};

const getUnixTimestamp = (date) => {
  return Math.floor(date.getTime() / 1000);
};

export const displayMeetingTime = (timeframe) => {
  const [startTime, endTime] = [timeframe.start_time, timeframe.end_time].map(
    (timestamp) => {
      return get12HourTime(timestamp).toLowerCase();
    }
  );

  return `${
    startTime.slice(-2) === endTime.slice(-2)
      ? startTime.slice(0, -3)
      : startTime
  } - ${endTime}`;
};

export const convertUTCDate = (date) => {
  const utcDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000
  );

  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();

  utcDate.setHours(hours - offset);

  return utcDate;
};

export const applyTimezone = (date) => {
  const localizedDate = new Date(date);

  return getUnixTimestamp(localizedDate);
};

export const getTodaysDateTimestamp = () => {
  const date = new Date();
  return applyTimezone(convertUTCDate(date));
};

export const getSevenDaysFromTodayDateTimestamp = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return applyTimezone(convertUTCDate(new Date(date)));
};

export const getEventDate = (calendarEvent) => {
  return new Date(
    calendarEvent.when.object === 'date'
      ? calendarEvent.when.date
      : calendarEvent.when.start_time * 1000
  );
};

export const getFormattedDate = (event) => {
  const date = getEventDate(event);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  return `${month} ${day}`;
};

export const getTimezoneCode = () => {
  return DateTime.local().toFormat('ZZZZ');
};

export const getDefaultEventStartTime = () => {
  const startDate = getNextHalfHour();
  return convertUTCDate(startDate);
};

export const getDefaultEventEndTime = () => {
  const startDate = getNextHalfHour();
  const endDate = getOneHourFromPassedTimestamp(startDate);
  return convertUTCDate(endDate);
};

export const getMinimumEventEndTime = (inputDate) => {
  const date = new Date(inputDate);
  date.setMinutes(date.getMinutes() + 1);
  return date;
};
