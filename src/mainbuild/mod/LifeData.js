import SimpleData from './../data/SimpleData'
import IdData from './IdData'

/*
传参问题不能用apply解决，避免箭头函数产生的this指向错误问题
生命周期函数暂行方案
通过Map实现，可实现对应的顺序
基本周期函数
created
beforeLoad
loaded
loadFail
beforeUpdate
updated
updateFail
beforeReset
reseted
beforeDestroy
destroyed
*/

let lifeId = new IdData({
  list: [
    {
      type: 'time'
    },
    {
      type: 'id'
    }
  ]
})

class LifeData extends SimpleData {
  constructor (initdata = {}) {
    super(initdata)
    this.data = {}
    this._initMain(initdata)
  }
  _initMain ({ list }) {
    this.initList(list)
  }
  initList (list = []) {
    for (let n in list) {
      this.build(list[n])
    }
  }
  // 计算名称
  buildName () {
    return lifeId.getData()
  }
  build(type) {
    if (!this.check(type)) {
      this.data[type] = {
        data: new Map()
      }
    }
  }
  get(type) {
    this.build(type)
    return this.data[type]
  }
  check(type) {
    return this.data[type]
  }
  // 设置生命周期回调
  on (type, data) {
    this.build(type)
    let dataType = typeof data
    let next = true
    if (dataType == 'function') {
      data = {
        func: data
      }
    } else if (dataType != 'object') {
      next = false
    }
    if (next) {
      if (data.func) {
        if (!data.name) {
          data.name = this.buildName()
        }
        if (this.data[type].data.has(data.name) && !data.repalce) {
          this._printInfo(`生命周期存在当前值:${data.name}`)
        } else {
          this.data[type].data.set(data.name, {
            once: data.once,
            func: data.func
          })
          if (data.immediate) {
            this.triggerData({ type, name: data.name })
          }
          return data.name
        }
      } else {
        this._printInfo(`生命周期(${type}:${data.name || '-'})设置中未定义func`)
      }
    } else {
      this._printInfo(`生命周期${type}设置data参数需要object或者function`)
    }
    return false
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
    this.build(type)
    for (let key of this.data[type].data.keys()) {
      this.triggerData({
        type: type,
        name: key
      }, ...args)
    }
  }
  // 删除生命周期指定函数
  off (type, name) {
    if (this.check(type)) {
      return this.data[type].data.delete(name)
    }
  }
  // 清除生命周期
  clear (type) {
    if (this.check(type)) {
      this.data[type].data.clear()
    }
  }
  reset () {
    for (let n in this.data) {
      this.clear(n)
    }
  }
  // 销毁
  destroy () {
    this.reset()
  }
}

export default LifeData
