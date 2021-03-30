import _func from '@/maindata/func/index'

class ExtraData {
  constructor (data = {}) {
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
  install(target) {
    let dict = [
      {
        prop: 'initExtra',
        originProp: 'initData'
      },
      {
        prop: 'setExtra',
        originProp: 'setData'
      },
      {
        prop: 'getExtra',
        originProp: 'getData'
      },
      {
        prop: 'clearExtra',
        originProp: 'clearData'
      },
      {
        prop: 'resetExtra',
        originProp: 'reset'
      }
    ]
    for (let n = 0; n < dict.length; n++) {
      let dictData = dict[n]
      if (!target[dictData.prop]) {
        target[dictData.prop] = (...args) => {
          this[dictData.originProp](...args)
        }
      } else {
        target._printInfo(`存在${dictData.prop}方法,${this._selfName()}install=>${dictData.originProp}失败`)
      }
    }
  }
  _selfName () {
    return `[CLASS:${this.constructor.name}]`
  }
}

export default ExtraData
