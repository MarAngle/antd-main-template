
import SimpleData from './../data/SimpleData'

/*
传参问题不能用apply解决，避免箭头函数产生的this指向错误问题
生命周期函数暂行方案
通过Map实现，可实现对应的顺序
基本周期函数
created
beforeLoad
loaded
unload 加载失败
beforeDestroy
destroyed
*/

const defaultList = ['created', 'beforeLoad', 'loaded', 'loadFail', 'beforeUpdate', 'updated', 'updateFail', 'beforeReset', 'reseted', 'beforeDestroy', 'destroyed']
let key = 0

class LifeData extends SimpleData {
  constructor (initdata = {}) {
    super(initdata)
    this.data = {}
    this._initMain(initdata)
  }
  _initMain ({ list }) {
    this._initData(list)
  }
  _initData (list = []) {
    let finalList = defaultList.concat(list)
    for (let n in finalList) {
      this.data[finalList[n]] = {
        data: new Map()
      }
    }
  }
  // 计算名称
  countName () {
    key++
    return key
  }
  // 设置生命周期回调
  setData ({ type, name, immediate, once, func, repalce }) {
    if (!name) {
      name = this.countName()
    }
    if (this.data[type].data.has(name) && !repalce) {
      this._printInfo(`生命周期存在当前值:${name}`)
    } else if (!func) {
      this._printInfo(`生命周期${type}:${name}设置中未存在func`)
    } else {
      this.data[type].data.set(name, {
        once: once,
        func: func
      })
      if (immediate) {
        this.triggerData({ type, name })
      }
      return name
    }
  }
  // 触发生命周期指定函数
  triggerData ({ type, name }, ...args) {
    let data = this.data[type].data.get(name)
    if (data.func) {
      data.func(...args)
      if (data.once) {
        this.deleteData({ type, name })
      }
    }
  }
  // 触发生命周期
  trigger (type, ...args) {
    for (let key of this.data[type].data.keys()) {
      this.triggerData({
        type: type,
        name: key
      }, ...args)
    }
  }
  // 清除生命周期
  clear (type) {
    this.data[type].data.clear()
  }
  // 删除生命周期指定函数
  deleteData ({ type, name }) {
    return this.data[type].data.delete(name)
  }
  // 销毁
  destroy () {
    for (let n in this.data) {
      this.clear(n)
    }
  }
}

export default LifeData
