import _func from '@/maindata/func/index'

let proxyCanUse = _func.getCanUse('proxy')
let proxyOption = {
  get: function(target, key) {
    console.warn(`非预期操作提醒: 正在对空数据对象进行属性${key}的获取操作！`)
    if (target[key]) {
      return target[key]
    } else {
      return null
    }
  }
}

// 空数据对象
class EmptyData {
  constructor () {
    if (proxyCanUse) {
      return new Proxy(this, proxyOption)
    } else {
      return this
    }
  }
  toString() {
    return null
  }
}

export default EmptyData
