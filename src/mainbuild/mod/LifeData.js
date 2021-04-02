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
  build(type, auto = true) {
    if (!this.data[type] && auto) {
      this.data[type] = {
        data: new Map()
      }
    }
  }
  get(type, auto) {
    this.build(type, auto)
    return this.data[type]
  }
  // 设置生命周期回调
  on (type, data) {
    let lifeItem = this.get(type)
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
        if (lifeItem.data.has(data.name) && !data.repalce) {
          this._printInfo(`生命周期[${type}]存在当前值:${data.name}`)
        } else {
          lifeItem.data.set(data.name, {
            once: data.once,
            func: data.func
          })
          if (data.immediate) {
            this.triggerData(type, data.name)
          }
          return data.name
        }
      } else {
        this._printInfo(`生命周期[${type}]设置(${data.name || '-'})未定义func`)
      }
    } else {
      this._printInfo(`生命周期${type}设置data参数需要object或者function`)
    }
    return false
  }
  // 触发生命周期指定函数
  triggerData (type, name, ...args) {
    let lifeItem = this.get(type)
    if (lifeItem) {
      let data = lifeItem.data.get(name)
      if (data) {
        if (data.func) {
          data.func(...args)
          if (data.once) {
            this.off(type, name)
          }
        }
      } else {
        this._printInfo(`生命周期[${type}]不存在当前值(${name})`)
      }
    } else {
      this._printInfo(`不存在当前生命周期[${type}]`)
    }
  }
  // 触发生命周期
  trigger (type, ...args) {
    let lifeItem = this.get(type)
    if (lifeItem) {
      for (let key of lifeItem.data.keys()) {
        this.triggerData(type, key, ...args)
      }
    }
  }
  // 删除生命周期指定函数
  off (type, name) {
    let lifeItem = this.get(type)
    if (lifeItem) {
      return lifeItem.data.delete(name)
    }
  }
  // 清除生命周期
  clear (type) {
    let lifeItem = this.get(type)
    if (lifeItem) {
      lifeItem.data.clear()
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
