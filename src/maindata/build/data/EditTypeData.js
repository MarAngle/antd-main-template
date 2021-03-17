import _func from '@/maindata/func/index'
import moment from 'moment'
import currentDate from './currentDate'

function timeOptionFormat(option, range) {
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
}

const timeCheckUtils = {
  formatDict: {
    day: 'YYYYMMDD',
    hour: 'YYYYMMDDHH',
    min: 'YYYYMMDDHHmm',
    sec: 'YYYYMMDDHHmmss'
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
  }
}

function timeCheckOptionFormat(option) {
  return timeCheckUtils.formatOption(option)
}

function timeCheck(value, { start, end, format }) {
  let disabled = false
  if (value) {
    if (start) {
      let startLimit = timeCheckUtils.getTime(start.data)
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
      let endLimit = timeCheckUtils.getTime(end.data)
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

let editTypeData = {
  data: {
    type_input: {
      defaultdata: '',
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请输入${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['blur'],
        autoTrigger: ['input', 'change'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请输入${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_inputNumber: {
      defaultdata: '',
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请输入${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['blur'],
        autoTrigger: ['input', 'change'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请输入${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_switch: {
      defaultdata: false,
      eventList: ['change']
    },
    type_select: {
      defaultdata: undefined,
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请选择${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['blur'],
        autoTrigger: ['change', 'select'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_date: {
      defaultdata: undefined,
      timeOptionFormat: timeOptionFormat,
      timeCheck: timeCheck,
      timeCheckOptionFormat: timeCheckOptionFormat,
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请选择${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: 'change',
        autoTrigger: ['ok'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_dateRange: {
      defaultdata: [],
      timeOptionFormat: timeOptionFormat,
      timeCheck: timeCheck,
      timeCheckOptionFormat: timeCheckOptionFormat,
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请选择${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: 'change',
        autoTrigger: ['ok'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_file: {
      defaultdata: undefined,
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `上传${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['input', 'change'],
        autoTrigger: [],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `上传${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_button: {
      defaultdata: undefined,
      eventList: ['click'],
      placeholder: function (label) {
        return label.getMain()
      }
    },
    type_slot: {
      defaultdata: undefined
    }
  }
}

editTypeData.getData = function (type) {
  let prop = 'type_' + type
  if (this.data[prop]) {
    return this.data[prop]
  } else {
    console.error(`未找到对应的编辑逻辑:${type}`)
    return null
  }
}

export default editTypeData
