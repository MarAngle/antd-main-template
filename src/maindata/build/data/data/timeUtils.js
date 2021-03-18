import _func from '@/maindata/func/index'
import moment from 'moment'
import currentDate from './currentDate'

const timeUtils = {
  formatDict: {
    day: 'YYYYMMDD',
    hour: 'YYYYMMDDHH',
    min: 'YYYYMMDDHHmm',
    sec: 'YYYYMMDDHHmmss'
  },
  timeOptionFormat(option, range) {
    if (option) {
      let defaultValue = '00:00:00'
      if (option === true) {
        option = {}
      }
      if (!option.format) {
        option.format = 'HH:mm:ss'
      }
      if (range) {
        if (!option.defaultValue) {
          option.defaultValue = [defaultValue, defaultValue]
        }
      } else {
        if (!option.defaultValue) {
          option.defaultValue = defaultValue
        }
      }
    } else {
      option = false
    }
    return option
  },
  formatOption: function (option) {
    if (option) {
      option.start = this.formatTimeOption(option.start)
      option.end = this.formatTimeOption(option.end)
      option.format = this.getFormat(option.format)
    }
    return option
  },
  formatTimeOption: function (timeOption) {
    if (timeOption) {
      if (timeOption === 'current') {
        timeOption = {
          data: 'current'
        }
      } else if (moment.isMoment(moment)) {
        timeOption = {
          data: timeOption
        }
      } else {
        let type = _func.getType(timeOption)
        if (type !== 'object') {
          timeOption = {
            data: moment(timeOption)
          }
        }
      }
      if (timeOption.eq === undefined) {
        timeOption.eq = false
      }
    } else {
      timeOption = false
    }
    return timeOption
  },
  getFormat: function (format = 'min') {
    if (this.formatDict[format]) {
      return this.formatDict[format]
    } else {
      return format
    }
  },
  getTime: function (time) {
    if (time == 'current') {
      return currentDate.getCurrent()
    } else {
      return time
    }
  },
  timeCheck: function (value, { start, end, format }) {
    let disabled = false
    if (value) {
      if (start) {
        let startLimit = this.getTime(start.data)
        // 当前时间在开始时间前则禁止
        if (!start.eq) {
          disabled = value.format(format) - startLimit.format(format) < 0
        } else {
          // 当前时间不能等于开始时间
          disabled = value.format(format) - startLimit.format(format) <= 0
        }
      }
      // 开始时间通过后继续检查结束时间
      if (!disabled && end) {
        let endLimit = this.getTime(end.data)
        // 当前时间在结束时间后则禁止
        if (!end.eq) {
          disabled = value.format(format) - endLimit.format(format) > 0
        } else {
          // 当前时间不能等于结束时间
          disabled = value.format(format) - endLimit.format(format) >= 0
        }
      }
    }
    return disabled
  }
}

export default timeUtils
