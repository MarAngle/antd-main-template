import _func from '@/maindata/func/index'

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
      defaultdata: null,
      placeholder: function(name) {
        return `请选择${name}`
      }
    },
    type_dateRange: {
      defaultdata: [],
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
