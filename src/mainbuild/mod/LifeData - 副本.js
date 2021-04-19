import _func from '@/maindata/func/index'
import SimpleData from './../data/SimpleData'
import FuncData from './FuncData'
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
  constructor (initdata) {
    super()
    this.data = {}
    if (initdata) {
      this.initData(initdata)
    }
  }
  // 加载生命周期状态列表
  initData (data = {}, reset = true) {
    if (reset) {
      this.reset()
    }
    for (let n in data) {
      let item = data[n]
      let type = _func.getType(item)
      if (type == 'array') {
        for (let i = 0; i < item.length; i++) {
          let itemData = item[i]
          this.on(n, itemData, 'init')
        }
      } else {
        this.on(n, item, 'init')
      }
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
  setDataByIndex(lifeItem, data, name) {
    if (data.index === undefined || data.index == 'end') {
      lifeItem.data.set(data.id, data)
    } else {
      if (data.index == 'start') {
        data.index = 0
      }
      let size = lifeItem.data.size
      if (data.index < size) {
        let mapList = []
        lifeItem.data.forEach(function(value) {
          mapList.push(value)
        })
        lifeItem.data.clear()
        for (let n = 0; n < size; n++) {
          let mapItem = mapList[n]
          if (data.index == n) {
            lifeItem.data.set(data.id, data)
          }
          lifeItem.data.set(mapItem.id, mapItem)
        }
      } else {
        lifeItem.data.set(data.id, data)
      }
    }
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
          this.printInfo(`生命周期[${name}]存在当前值:${data.id}`)
        } else {
          this.setDataByIndex(lifeItem, data, name)
          if (data.immediate) {
            this.emit(name, data.id)
          }
          return data.id
        }
      } else {
        this.printInfo(`生命周期[${name}]设置(${data.id || '-'})未定义func`)
      }
    } else {
      this.printInfo(`生命周期${name}设置data参数需要object或者function`)
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
        this.printInfo(`生命周期[${name}]不存在当前值(${id})`)
      }
    } else {
      this.printInfo(`不存在当前生命周期[${name}]`)
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
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '生命周期数据格式',
        build: [
          {
            prop: 'data',
            type: 'object',
            describe: '生命周期设置数据(key=>value)'
          }
        ],
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: '生命周期数据保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

LifeData.initInstrcution()

export default LifeData
