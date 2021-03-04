import _func from '@/maindata/func/index'
import ExtraData from './../mod/ExtraData'

class DefaultData {
  constructor (initdata = {}) {
    this.module = {
      extra: new ExtraData()
    }
    this.initData(initdata)
  }
  initData ({ name, prop, extra, func, methods }) {
    this.name = name || ''
    this.prop = prop || ''
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
  // --额外数据相关--*/
  // 加载额外数据
  initExtra (extraData) {
    if (extraData) {
      let fg = this.module.extra.initData(extraData)
      if (!fg) {
        this._printInfo(`设置ExtrData出错`)
      }
    }
  }
  // 设置额外数据
  setExtra (prop, data) {
    this.module.extra.setData(prop, data)
  }
  // 获取额外数据
  getExtra (prop) {
    return this.module.extra.getData(prop)
  }
  // 清除额外数据
  clearExtra (prop) {
    this.module.extra.clearData(prop)
  }
  // 重置额外数据
  resetExtra () {
    this.module.extra.reset()
  }
  _getPrintInfo (content) {
    return `${this._selfName()}:${content}`
  }
  _printInfo (content, type = 'error', nextContent, nextType = type) {
    console[type](this._getPrintInfo(content))
    if (nextContent) {
      console[nextType](nextContent)
    }
  }
  _selfName () {
    return `[CLASS:${this.constructor.name}-${this.name}/${this.prop}]`
  }
}

export default DefaultData
