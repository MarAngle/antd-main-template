import _func from '@/maindata/func/index'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import ExtraData from './../mod/ExtraData'
import ParentData from './../mod/ParentData'

class DefaultData extends SimpleData {
  constructor (initdata = {}) {
    super(initdata)
    this.module = new ModuleData({
      extra: new ExtraData(),
      parent: new ParentData()
    }, this)
    this.initDefaultData(initdata)
  }
  initDefaultData ({ name, prop, parent, extra, func, methods }) {
    this.name = name || ''
    this.prop = prop || ''
    this.setParent(parent)
    this.initExtra(extra)
    this.initFunc(func)
    this.initMethods(methods)
  }
  // 加载func中的函数
  initFunc (func) {
    this.func = {}
    for (let n in func) {
      this.func[n] = func[n].bind(this)
    }
  }
  // 挂载方法
  initMethods (methods) {
    for (let n in methods) {
      let build = true
      if (this[n]) {
        let type = _func.getType(this[n])
        if (type !== 'function') {
          this._printInfo(`自定义函数${n}存在同名属性，未生效!`)
          build = false
        } else {
          this._printInfo(`method:${n}已被改写!`, 'warn')
        }
      }
      if (build) {
        this[n] = methods[n]
      }
    }
  }
  // 模块加载相关
  initModule(data) {
    return this.module.initData(data)
  }
  setModule(prop, data) {
    return this.module.setData(prop, data)
  }
  getModule(prop) {
    return this.module.getData(prop)
  }
  //
  // --- 父数据相关 --- //
  // 设置父实例
  setParent (data) {
    this.getModule('parent').setData(data)
  }
  // 获取上级实例
  getParent (n) {
    return this.getModule('parent').getData(n)
  }
  // --额外数据相关--*/
  // 加载额外数据
  initExtra (extraData) {
    if (extraData) {
      let fg = this.getModule('extra').initData(extraData)
      if (!fg) {
        this._printInfo(`设置ExtrData出错`)
      }
    }
  }
  // 设置额外数据
  setExtra (prop, data) {
    this.getModule('extra').setData(prop, data)
  }
  // 获取额外数据
  getExtra (prop) {
    return this.getModule('extra').getData(prop)
  }
  // 清除额外数据
  clearExtra (prop) {
    this.getModule('extra').clearData(prop)
  }
  // 重置额外数据
  resetExtra () {
    this.getModule('extra').reset()
  }
  _selfName () {
    let parent = this.getParent()
    let pre
    if (parent && parent._selfName) {
      pre = `(${parent._selfName()})-`
    }
    if (!pre) {
      pre = ``
    }
    return `{${pre}[${this.constructor.name}-${this.name}/${this.prop}]}`
  }
}

export default DefaultData
