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
    // 组件事件监控
    this.on = editdata.on || {}
    let typeOption = editTypeData.getData(this.type)
    this.initValue(editdata, typeOption)
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
    // 插件单独的props设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
    this.props = editdata.props || {}

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
      // 考虑位置在data.list的可行性
      this.option.list = editdata.option.list || []
      this.option.mode = editdata.option.mode || 'default' // 设置 Select 的模式为多选或标签	'default' | 'multiple' | 'tags' | 'combobox'
      this.option.multiple = editdata.option.multiple || false
      this.option.optionValue = editdata.option.optionValue || 'value'
      this.option.optionLabel = editdata.option.optionLabel || 'label'
      this.option.optionDisabled = editdata.option.optionDisabled || 'disabled'
      this.option.popupLocation = editdata.option.popupLocation || 'form'
      this.option.hideArrow = editdata.option.hideArrow || false
      this.option.hideClear = editdata.option.hideClear || false
      this.option.filterOption = editdata.option.filterOption || false // 是否自动过滤
      this.option.autoWidth = editdata.option.autoWidth || false // 宽度自适应
      this.option.noDataContent = editdata.option.noDataContent // 无数据时文字显示 == 默认不传使用antd的默认模板
      if (this.option.multiple) {
        this.setValueToArray()
      }
      // 添加默认的重置选项数据
      if (!this.func.clearData) {
        this.func.clearData = () => {
          this.option.list = []
          if (this.pagination) {
            this.pagination.setTotal(0)
          }
        }
      }
      // 存在分页相关设置
      if (editdata.option.pagination) {
        if (!this.func.page) {
          if (this.getData) {
            this._printInfo('选择器存在分页器时需要定义page回调或者getData函数供分页时调用')
          }
          this.func.page = (act, data) => {
            this.loadData(true).then(res => {}, err => { this._printInfo('loadData失败！', 'error', err) })
          }
        }
        let paginationOption = editdata.option.pagination
        if (paginationOption === true) {
          paginationOption = {
            size: 10,
            mod: {
              sizehidden: true,
              jumphidden: true,
              total: 'hidden'
            }
          }
        }
        this.pagination = new PaginationData(paginationOption)
      } else {
        this.pagination = null
      }
      // 检索下拉设置
      let search = editdata.option.search
      if (!search) {
        search = {
          show: false
        }
      } else if (search === true) {
        search = {
          show: true
        }
      }
      this.option.search = {
        show: search.show, // 检索模式开启判断值
        value: '', // 当前检索数据
        min: search.min || 0, // 检索触发值，auto模式下
        noDataContent: search.noDataContent || this.option.noDataContent,
        noSizeContent: search.noSizeContent || 0,
        auto: search.auto === undefined ? true : search.auto // 是否load检索
      }
      this.option.search.noSizeContent = search.noSizeContent || `请输入${this.option.search.min}位及以上的值检索`
      if (this.option.search.show && this.option.search.auto) {
        this.option.search.value = ''
        let handleSearch = this.on.search
        this.on.search = (...args) => {
          this.func.searchStart(...args)
          if (handleSearch) {
            handleSearch(...args)
          }
        }
        let handleOpen = this.on.open
        this.on.open = (...args) => {
          console.log('open', args)
          this.func.openStart(...args)
          if (handleOpen) {
            handleOpen(...args)
          }
        }
        if (!this.func.openStart) {
          this.func.openStart = (value) => {
            // ???
            console.log(value, this.getValueData('initdata'), this.getValueData('defaultdata'))
            if (value) {
              if (this.getValueData('initdata') === this.getValueData('defaultdata')) {
                this.on.search('')
              }
            }
          }
        }
        if (!this.func.autoSearch) {
          this.func.autoSearch = (act) => {
            if (act == 'init') {
              let num = this.option.search.value.length
              if (num < this.option.search.min) {
                this.option.noDataContent = this.option.search.noSizeContent
                this.func.clearData()
                return false
              } else {
                return true
              }
            } else if (act == 'loading') {
              this.option.noDataContent = '检索中...'
              return true
            } else if (act == 'loaded') {
              if (this.option.list.length <= 0) {
                this.option.noDataContent = this.option.search.noDataContent
                return false
              } else {
                return true
              }
            }
          }
        }
        // 通过生命周期触发对应的状态操作
        this.setLifeData({
          type: 'beforeLoad',
          name: 'autoSearchBeforeLoad',
          func: () => {
            this.func.autoSearch('loading')
          }
        })
        this.setLifeData({
          type: 'loaded',
          name: 'autoSearchLoaded',
          func: () => {
            this.func.autoSearch('loaded')
          }
        })
        this.setLifeData({
          type: 'loadFail',
          name: 'autoSearchLoadFail',
          func: () => {
            this.func.clearData()
            this.func.autoSearch('loaded')
          }
        })
        // 生命周期设置完成
        if (!this.func.searchStart) {
          this.func.searchStart = (value) => {
            this.option.search.value = value || ''
            if (this.func.autoSearch('init')) {
              this.loadData(true, this.option.search.value).then(res => {}, err => { this._printInfo('loadData失败！', 'error', err) })
            }
          }
        }
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

  initValue(editdata, typeOption) {
    if (_func.hasProp(editdata, 'defaultdata')) {
      this.setValueData(editdata.defaultdata, 'defaultdata')
    } else {
      this.setValueData(typeOption.defaultdata, 'defaultdata')
    }
    if (_func.hasProp(editdata, 'initdata')) {
      this.value.initdata = editdata.initdata
    } else {
      this.value.initdata = this.value.defaultdata
    }
    if (_func.hasProp(editdata, 'resetdata')) {
      this.value.resetdata = editdata.resetdata
    } else {
      this.value.resetdata = this.value.defaultdata
    }
  }
  setValueToArray() {
    let proplist = ['initdata', 'defaultdata', 'resetdata']
    for (let n in proplist) {
      let prop = proplist[n]
      let type = _func.getType(this.getValueData(prop))
      if (type != 'array') {
        this.setValueData([], prop)
      }
    }
    // ???? 多于操作???
    /// ------
    /// -------!!!!!
    this.setValueData([], 'defaultdata')
  }
  setValueData(data, prop = 'defaultdata') {
    this.value[prop] = data
  }
  getValueData(prop = 'defaultdata') {
    return this.value[prop]
  }
}
export default EditData
