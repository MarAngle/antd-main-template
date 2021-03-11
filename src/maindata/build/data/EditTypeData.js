import _func from '@/maindata/func/index'
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

function timeCheck(value, { start, end, format }) {

}

let editTypeData = {
  data: {
    type_input: {
      defaultdata: '',
      placeholder: function(name) {
        return `请输入${name}`
      }
    },
    type_inputNumber: {
      defaultdata: '',
      placeholder: function(name) {
        return `请输入${name}`
      }
    },
    type_switch: {
      defaultdata: false
    },
    type_select: {
      defaultdata: undefined,
      placeholder: function(name) {
        return `请选择${name}`
      }
    },
    type_date: {
      defaultdata: undefined,
      timeOptionFormat: timeOptionFormat,
      timeCheck: timeCheck,
      placeholder: function(name) {
        return `请选择${name}`
      }
    },
    type_dateRange: {
      defaultdata: [],
      timeOptionFormat: timeOptionFormat,
      timeCheck: timeCheck,
      placeholder: function(name) {
        return `请选择${name}`
      }
    },
    type_file: {
      defaultdata: undefined,
      placeholder: function(name) {
        return `上传${name}`
      }
    },
    type_button: {
      defaultdata: undefined
    }
  }
}

editTypeData.getData = function(type) {
  let prop = 'type_' + type
  if (this.data[prop]) {
    return this.data[prop]
  } else {
    console.error(`未找到对应的编辑逻辑:${type}`)
    return null
  }
}

export default editTypeData
