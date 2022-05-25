import moment from 'moment';

const getGermanDateFormat = (timestamp) => moment(timestamp).format('DD.MM.YYYY hh:mm');

const getTimeBetween = (earlierDate, laterDate) => moment(laterDate).diff(moment(earlierDate));

const getMinutesBetween = (earlierDate, laterDate) => moment(laterDate).diff(moment(earlierDate), 'minutes');

const getHoursBetween = (earlierDate, laterDate) => moment(laterDate).diff(moment(earlierDate), 'hours');

const getDaysBetween = (earlierDate, laterDate) => moment(laterDate).diff(moment(earlierDate), 'days');

const getWeeksBetween = (earlierDate, laterDate) => moment(laterDate).diff(moment(earlierDate), 'weeks');

const convert24HoursToAMPM = (timestring) => moment(timestring, 'hh:mm:ss').format('hh:mm:ss a');

export { getGermanDateFormat, getTimeBetween, getMinutesBetween, getHoursBetween, getDaysBetween, getWeeksBetween, convert24HoursToAMPM };
