import _func from '@/maindata/func/index'
import DefaultData from './DefaultData'
import OptionData from './OptionData'

// 本地选择器数据格式化
class SelectList extends DefaultData {
  constructor (initdata = {}) {
    super(initdata)
    this.option = new OptionData({
      dataTarget: {
        value: 'value',
        label: 'label'
      },
      unhit: {
        value: undefined, // value值默认设置，true为设置为第一个选项,其他遍历选项
        deep: true, // 深拷贝判断值
        deepOption: undefined // 深拷贝设置值
      },
      undef: {
        unhit: true, // 复制unhit
        value: undefined, // 同上
        deep: true, // 深拷贝判断值
        deepOption: undefined // 深拷贝设置值
      },
      equal: '==',
      deep: true
    })
    this.data = {
      list: []
    }
    this.unhitData = {
    }
    this.undefData = {
    }
    this.format = {
      type: false
    }
    this._initSelectList(initdata)
  }
  _initSelectList ({
    data,
    option,
    format,
    unhitData,
    undefData
  }) {
    this._initOption(option)
    this._initDataList(data)
    this._initFormat(format)
    this._initUnhitData(unhitData)
    this._initUndefData(undefData)
  }
  // 加载设置
  _initOption (option = {}) {
    this.option.initData(option)
  }
  // 加载数据
  _initDataList (data) {
    if (data) {
      let dataType = _func.getType(data)
      let dataOption
      let dataList
      if (dataType == 'array') {
        dataList = data
      } else {
        dataList = data.list
        dataOption = data.option
      }
      if (dataOption) {
        this.data.list = _func.formatList(dataList, dataOption)
      } else {
        this.data.list = dataList
      }
    }
  }
  // 加载格式化设置
  _initFormat (format) {
    if (format) {
      let formatType = _func.getType(format)
      if (formatType == 'object') {
        this.format = format
      } else if (formatType == 'number') {
        this.format = {
          type: 'number',
          offset: this.format
        }
      } else if (formatType == 'string') {
        this.format = {
          type: 'string',
          head: this.format,
          foot: ''
        }
      }
    }
  }
  // 加载未命中数据
  _initUnhitData (unhitData) {
    if (unhitData) {
      this.unhitData = unhitData
    } else {
      let unhitOption = this.option.getData('unhit')
      let deep = unhitOption.deep
      let deepOption = unhitOption.deepOption
      let value = unhitOption.value
      if (!this.checkUndef(value)) {
        if (value === true) {
          // 可能为空
          value = this.getItemByIndex(0).value
        }
        this.unhitData = this.getItem(value, { deep, deepOption })
      }
    }
  }
  // 加载未定义数据， 默认等同于未命中数据
  _initUndefData (undefData) {
    if (undefData) {
      this.undefData = undefData
    } else {
      let undefOption = this.option.getData('undef')
      let deep = undefOption.deep
      let deepOption = undefOption.deepOption
      if (undefOption.unhit) {
        this.undefData = this.formatItemByDeep(this.getUnhitData(), { deep, deepOption })
      } else {
        let value = undefOption.value
        if (!this.checkUndef(value)) {
          if (value === true) {
            value = this.getItemByIndex(0).value
          }
          this.undefData = this.getItem(value, deepOption)
        }
      }
    }
  }
  // 根据数据格式化value，差异化使用
  formatValue (value) {
    if (!this.format.type) {
      return value
    } else if (this.format.type == 'number') {
      return Number(value) + this.format.offset
    } else if (this.format.type == 'string') {
      return this.format.head + value + this.format.foot
    }
  }
  // 获取未命中默认值
  getUnhitData () {
    return this.unhitData
  }
  // 获取未定义默认值
  getUndefData () {
    return this.undefData
  }
  // 获取全列表，可根据format条件筛选
  getList (payload = {}) {
    let list = []
    if (!payload.format) {
      list = this.data.list
    } else {
      for (let n in this.data.list) {
        if (payload.format(this.data.list[n])) {
          list.push(this.data.list[n])
        }
      }
    }
    if (payload.deep === undefined) {
      payload.deep = true
    }
    if (payload.deep) {
      list = _func.deepClone(list, payload.deepOption)
    }
    return list
  }
  // 检查value数据是否相同
  checkItem (itemvalue, value) {
    let equal = this.option.getData('equal')
    value = this.formatValue(value)
    if (equal == '===') {
      return itemvalue === value
    } else {
      return itemvalue == value
    }
  }
  // 检查undef值判断，可重写
  checkUndef (value) {
    return value === undefined
  }
  formatItemByDeep (item, { deep, deepOption }) {
    if (deep === undefined) {
      deep = this.option.getData('deep')
    }
    if (deep) {
      item = _func.deepClone(item, deepOption)
    }
    return item
  }
  // 获取对象
  getItem (value, payload = {}) {
    let res
    if (this.checkUndef(value)) {
      res = this.getUndefData()
    } else {
      let prop = payload.prop
      if (!prop) {
        let dataTarget = this.option.getData('dataTarget')
        prop = dataTarget.value
      }
      for (let n in this.data.list) {
        let item = this.data.list[n]
        if (this.checkItem(item[prop], value)) {
          res = item
          break
        }
      }
    }
    if (!res) {
      res = this.getUnhitData()
    }
    res = this.formatItemByDeep(res, payload)
    return res
  }
  // 根据index获取对象
  getItemByIndex (index, payload = {}) {
    let res = this.data.list[index]
    if (!res) {
      res = this.getUnhitData()
    }
    res = this.formatItemByDeep(res, payload)
    return res
  }
}
export default SelectList
