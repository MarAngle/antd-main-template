import _func from '@/maindata/func/index'
import SimpleData from './../data/SimpleData'

const instrcutionData = {
  build: [
    {
      prop: 'data',
      type: 'object',
      describe: '额外数据对象',
      required: false
    }
  ],
  data: [
    {
      prop: 'data',
      type: 'object',
      describe: '额外数据保存位置'
    }
  ],
  method: []
}
class ExtraData extends SimpleData {
  constructor (data = {}) {
    super()
    this.data = {}
    this._initMain(data)
  }
  _initMain (data) {
    this.initData(data)
  }
  // 加载数据
  initData (data) {
    let dataType = _func.getType(data)
    if (dataType == 'object') {
      for (let n in data) {
        this.setData(n, data[n])
      }
      return true
    } else {
      return false
    }
  }
  // 设置数据
  setData (prop, data) {
    this.data[prop] = data
  }
  // 获取数据
  getData (prop) {
    if (!prop) {
      return this.data
    } else {
      return this.data[prop]
    }
  }
  // 清除数据
  clearData (prop) {
    if (!prop) {
      this.data = {}
    } else {
      delete this.data[prop]
    }
  }
  reset () {
    this.clearData()
  }
}

ExtraData.buildInstrcution(instrcutionData, 'SimpleData')

export default ExtraData
