import _func from '@/maindata/func/index'
import { BaseData, ParentData, PaginationData } from '@/mainbuild/index'
import editTypeData from './EditTypeData'

function formatDateTimeOption(option, range) {
  const defaultValueData = '00:00:00'
  if (option) {
    if (option === true) {
      option = {}
    }
    if (!option.format) {
      option.format = 'HH:mm:ss'
    }
    if (range == 'range') {
      let defaultValue = option.defaultValue || []
      option.defaultValue = [_func.moment(defaultValue[0] || defaultValueData, option.format), _func.moment(defaultValue[1] || defaultValueData, option.format)]
    } else {
      let defaultValue = option.defaultValue || defaultValueData
      option.defaultValue = _func.moment(defaultValue, option.format)
    }
  } else {
    option = false
  }
  return option
}

class EditData extends BaseData {
  constructor(editdata, payload) {
    super(editdata)
    this._initMainByEditData(editdata, payload)
  }
  _initMainByEditData(editdata, payload = {}) {
    this._initParent(payload)
    this.initMain(editdata)
    this.initSlot(editdata)
    this.initTips(editdata)
    this.initType(editdata, payload)
  }
  _initParent({ parent }) {
    this.parentdata = new ParentData(parent)
  }
  setParent(data) {
    this.parentdata.setData(data)
  }
  getParent(n) {
    return this.parentdata.getData(n)
  }
  initMain(editdata) {
    this.reload = editdata.reload || false // 异步二次加载判断值
    this.hideLabel = editdata.hideLabel === undefined ? false : editdata.hideLabel
    this.colon = editdata.colon === undefined ? true : editdata.colon // label属性：显示判断值
    this.disabled = editdata.disabled || false
    this.option = {}
    this.value = {}
    // 宽度设置
    if (editdata.mainwidth) {
      let type = _func.getType(editdata.mainwidth)
      if (type == 'number') {
        this.mainwidth = editdata.mainwidth + 'px'
      } else {
        this.mainwidth = editdata.mainwidth
      }
    } else {
      this.mainwidth = 'auto'
    }
    if (editdata.width) {
      let type = _func.getType(editdata.width)
      if (type == 'number') {
        this.width = editdata.width + 'px'
      } else {
        this.width = editdata.width
      }
    } else {
      this.width = '100px'
    }
  }
  // slot格式化编辑数据
  initSlot (editdata) {
    if (editdata.slot) { // label main inside front end
      let slotType = _func.getType(editdata.slot)
      if (slotType == 'boolean') {
        // 布尔值为真
        this.slot = {
        }
      } else if (slotType == 'string') {
        // 字符串默认为main格式的slot名称
        this.slot = {
          name: editdata.slot
        }
      } else {
        this.slot = editdata.slot
      }
      if (!this.slot.name) {
        this.slot.name = this.prop
      }
    } else {
      this.slot = {
        name: this.prop
      }
    }
    if (!this.slot.label) {
      this.slot.label = this.prop + '-label'
    }
  }
  // 格式化编辑数据
  initTips (editdata) {
    // tips提示
    if (!editdata.tips) {
      this.tips = {
        data: ''
      }
    } else {
      let tipsType = _func.getType(editdata.tips)
      if (tipsType != 'object') {
        this.tips = {
          data: editdata.tips
        }
      } else {
        this.tips = editdata.tips
      }
    }
    if (!this.tips.placement) {
      this.tips.placement = 'topLeft'
    }
    if (!this.tips.trigger) {
      this.tips.trigger = 'hover'
    }
  }
  initType(editdata) {
    this.type = editdata.type || 'input'
    this.required = editdata.required || false
    let typeOption = editTypeData.getData(this.type)
    // 格式化占位符和检验规则
    if (typeOption.placeholder) {
      if (!editdata.placeholder) {
        this.placeholder = typeOption.placeholder(this.name)
      } else {
        this.placeholder = editdata.placeholder
      }
    }
    if (!editdata.option) {
      editdata.option = {}
    }
    this.option.props = editdata.option.props || {}

    if (this.type == 'input') {
      // INPUT
      this.option.type = editdata.option.type || 'text'
      this.option.maxLength = editdata.option.maxLength || 20
      this.option.hideClear = editdata.option.hideClear || false
    } else if (this.type == 'inputNumber') {
      // INPUTNUMBER
      this.option.max = editdata.option.max === undefined ? Infinity : editdata.option.max
      this.option.min = editdata.option.min === undefined ? -Infinity : editdata.option.min
      this.option.precision = editdata.option.precision === undefined ? 0 : editdata.option.precision // 精确到几位小数，接受非负整数
      this.option.step = editdata.option.step === undefined ? 1 : editdata.option.step // 点击步进
    } else if (this.type == 'select') {
      this.option.list = editdata.option.list || []
      this.option.multiple = editdata.option.multiple || false
      this.option.optionValue = editdata.option.optionValue || 'value'
      this.option.optionLabel = editdata.option.optionLabel || 'label'
      this.option.optionDisabled = editdata.option.optionDisabled || 'disabled'
      this.option.popupLocation = editdata.option.popupLocation || 'form'
      this.option.hideArrow = editdata.option.hideArrow || false
      this.option.hideClear = editdata.option.hideClear || false
      this.option.filterOption = editdata.option.filterOption || false
      this.option.autoWidth = editdata.option.autoWidth || false
      this.option.noDataContent = editdata.option.noDataContent
      if (this.option.multiple) {
        // ~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!
        this.setValueToArray()
      }
    } else if (this.type == 'datePicker') {
      // DATEPICKER
      this.option.format = editdata.option.format || 'YYYY-MM-DD'
      this.option.formatedit = editdata.option.formatedit || this.option.format
      this.option.showTime = formatDateTimeOption(editdata.option.showTime)
    } else if (this.type == 'dateRangePicker') {
      // DATERANGEPICKER
      this.option.format = editdata.option.format || 'YYYY-MM-DD'
      this.option.formatedit = editdata.option.formatedit || this.option.format
      this.option.separator = editdata.option.separator || '-'
      this.option.showTime = formatDateTimeOption(editdata.option.showTime, 'range')
      if (_func.getType(this.placeholder) != 'array') {
        this.placeholder = [this.placeholder, this.placeholder]
      }
    }
  }
}
export default EditData
