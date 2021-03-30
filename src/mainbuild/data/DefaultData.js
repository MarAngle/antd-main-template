import _func from '@/maindata/func/index'
import SimpleData from './SimpleData'
import ExtraData from './../mod/ExtraData'
import ParentData from './../mod/ParentData'

class DefaultData extends SimpleData {
  constructor (initdata = {}) {
    super(initdata)
    this.extra = new ExtraData()
    this.parent = new ParentData()
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
  // --- 父数据相关 --- //
  // 设置父实例
  setParent (data) {
    this.parent.setData(data)
  }
  // 获取上级实例
  getParent (n) {
    return this.parent.getData(n)
  }
  // --额外数据相关--*/
  // 加载额外数据
  initExtra (extraData) {
    if (extraData) {
      let fg = this.extra.initData(extraData)
      if (!fg) {
        this._printInfo(`设置ExtrData出错`)
      }
    }
  }
  // 设置额外数据
  setExtra (prop, data) {
    this.extra.setData(prop, data)
  }
  // 获取额外数据
  getExtra (prop) {
    return this.extra.getData(prop)
  }
  // 清除额外数据
  clearExtra (prop) {
    this.extra.clearData(prop)
  }
  // 重置额外数据
  resetExtra () {
    this.extra.reset()
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
