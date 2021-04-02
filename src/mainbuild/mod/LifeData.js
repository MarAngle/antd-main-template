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
  // 加载生命周期状态列表
  initList (list = []) {
    for (let n in list) {
      this.build(list[n])
    }
  }
  // 计算名称
  buildId () {
    return lifeId.getData()
  }
  // 创建对应的生命周期 auto = true
  build(name, auto = true) {
    if (!this.data[name] && auto) {
      this.data[name] = {
        data: new Map()
      }
    }
  }
  // 设置生命周期对应函数回调
  setData(name, lifeItem, data) {
    lifeItem.data.set(data.id, data)
    if (data.immediate) {
      this.emit(name, data.id)
    }
    return data.id
  }
  // 获取对应生命周期对象
  get(name, auto) {
    this.build(name, auto)
    return this.data[name]
  }
  // 设置生命周期回调
  on (name, data) {
    let lifeItem = this.get(name)
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
        if (!data.id) {
          data.id = this.buildId()
        }
        if (lifeItem.data.has(data.id) && !data.repalce) {
          this._printInfo(`生命周期[${name}]存在当前值:${data.id}`)
        } else {
          return this.setData(name, lifeItem, data)
        }
      } else {
        this._printInfo(`生命周期[${name}]设置(${data.id || '-'})未定义func`)
      }
    } else {
      this._printInfo(`生命周期${name}设置data参数需要object或者function`)
    }
    return false
  }
  // 触发生命周期指定函数
  emit (name, id, ...args) {
    let lifeItem = this.get(name)
    if (lifeItem) {
      let data = lifeItem.data.get(id)
      if (data) {
        if (data.func) {
          data.func(...args)
          if (data.once) {
            this.off(name, id)
          }
        }
      } else {
        this._printInfo(`生命周期[${name}]不存在当前值(${id})`)
      }
    } else {
      this._printInfo(`不存在当前生命周期[${name}]`)
    }
  }
  // 触发生命周期
  trigger (name, ...args) {
    let lifeItem = this.get(name)
    if (lifeItem) {
      for (let key of lifeItem.data.keys()) {
        this.emit(name, key, ...args)
      }
    }
  }
  // 删除生命周期指定函数
  off (name, id) {
    let lifeItem = this.get(name)
    if (lifeItem) {
      return lifeItem.data.delete(id)
    }
  }
  // 清除生命周期
  clear (name) {
    let lifeItem = this.get(name)
    if (lifeItem) {
      lifeItem.data.clear()
    }
  }
  // 重置
  reset () {
    for (let n in this.data) {
      this.clear(n)
    }
  }
  // 销毁
  destroy () {
    this.reset()
    this.data = {}
  }
}

export default LifeData
