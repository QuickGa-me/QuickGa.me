import moment from 'moment';
import {FullDate, FullTime} from '../models/common/fullDateTime';

export class FullDateUtils {
  static get now(): FullDate {
    return FullDateUtils.fromDate(new Date());
  }

  static compare(d1: FullDate, d2: FullDate) {
    return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
  }
  static endOfMonth(fullDate: FullDate): FullDate {
    const date = this.toDate(fullDate);
    return FullDateUtils.fromDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  }

  static fromDate(date: Date): FullDate {
    const dt = date;
    const epoch = new Date(1970, 0, 1);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      stamp: Math.ceil(moment(dt).diff(epoch, 'days')),
    };
  }

  static fromStamp(stamp: number): FullDate {
    return this.fromDate(new Date(1970, 0, stamp));
  }

  static fromString(date: string): FullDate {
    const strings = date.split('-');
    return this.fromDate(new Date(parseInt(strings[0], 10), parseInt(strings[1], 10) - 1, parseInt(strings[2], 10)));
  }

  static getString(date: FullDate) {
    return `${date.month}/${date.day}/${date.year}`;
  }

  static serverFormat(date: FullDate) {
    return `${date.year}-${date.month}-${date.day}`;
  }

  static toDate(date: FullDate, time?: FullTime) {
    if (time) {
      return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
    } else {
      return new Date(date.year, date.month - 1, date.day);
    }
  }

  static toDateUTC(date: FullDate, time: FullTime): Date {
    return new Date(Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute, time.second));
  }

  static toPretty(fullDate: FullDate) {
    return `${fullDate.year}-${fullDate.month}-${fullDate.day}`;
  }
}
export class FullTimeUtils {
  static get endOfDay(): FullTime {
    return this.fromPieces(23, 59, 59);
  }
  static get now(): FullTime {
    return FullTimeUtils.fromDate(new Date());
  }
  static get startOfDay(): FullTime {
    return this.fromPieces(0, 0, 0);
  }
  static addZero(time: number) {
    if (time < 10) {
      return `0${time}`;
    }
    return time;
  }

  static compare(d1: FullTime, d2: FullTime) {
    return d1.hour === d2.hour && d1.minute === d2.minute && d1.second === d2.second;
  }

  static fromDate(date: Date): FullTime {
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      stamp: date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds(),
    };
  }
  static fromPieces(hour: number, minute: number, second: number): FullTime {
    return {
      hour,
      minute,
      second,
      stamp: hour * 60 * 60 + minute * 60 + second,
    };
  }

  static fromStamp(value: number): FullTimeUtils {
    throw new Error('not implemented');
  }

  static serverFormat(time: FullTime) {
    return `${time.hour}-${time.minute}-${time.second}`;
  }
  static toDate(time: FullTime) {
    return new Date(1970, 0, 1, time.hour, time.minute, time.second);
  }
}
