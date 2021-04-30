import Require from './build/Require'
import utils from './data/utils'
import notice from './option/noticeData'

let mainfunc = {
  data: {}
}

mainfunc.printInfo = function(content = '', type = 'error') {
  let preContent = `[complex-func]`
  console[type](preContent + content)
}

mainfunc._initMod = function (mod, methodList) {
  if (methodList) {
    for (let i in methodList) {
      let methodData = methodList[i]
      if (typeof methodData != 'object') {
        methodData = {
          originprop: methodData,
          prop: methodData
        }
      }
      this._appendMethod(methodData.prop, mod[methodData.originprop], mod)
    }
  } else {
    for (let n in mod) {
      if (typeof mod[n] == 'function') {
        this._appendMethod(n, mod[n], mod)
      }
    }
  }
}

mainfunc._appendMethod = function (methodName, methodData, target) {
  let append = false
  if (methodData) {
    let methodType = typeof methodData
    if (methodType == 'function') {
      methodData = {
        data: methodData
      }
      append = true
    } else if (methodType == 'object') {
      append = true
    }
  }
  if (append) {
    if (!this[methodName]) {
      append = true
    } else if (methodData.replace) {
      append = true
      this.printInfo(`appendMethod: ${methodName} is replace`, 'warn')
    } else {
      this.printInfo(`appendMethod: ${methodName} is defined`)
    }
    if (append) {
      if (target) {
        this[methodName] = methodData.data.bind(target)
      } else {
        this[methodName] = methodData.data
      }
    }
  }
}

mainfunc.init = function({
  data, // 数据
  root, // 根对象
  methods, // 方法
  require, // 请求
  notice // 提示
}) {
  if (data) {
    for (let n in data) {
      this.data[n] = data[n]
    }
  }
  if (root) {
    for (let n in root) {
      if (this[n]) {
        this.printInfo(`root属性${n}设置冲突，请检查!`)
      } else {
        this[n] = root[n]
      }
    }
  }
  if (methods) {
    for (let n in methods) {
      this._appendMethod(n, methods[n])
    }
  }
  if (require) {
    this.initRequire(require)
  }
  if (notice) {
    this.initNotice(notice)
  }
}

mainfunc.initRequire = function (requireInitData) {
  let requiredata = new Require(requireInitData)
  this._initMod(requiredata, ['ajax', 'require', 'get', 'post', 'postform', 'postfile', 'setToken', 'getToken', 'removeToken'])
}

mainfunc.initNotice = function(noticeInitData = {}) {
  notice.data = noticeInitData.data || {}
  for (let n in noticeInitData.methods) {
    notice[n] = noticeInitData.methods[n]
  }
  mainfunc._initMod(notice)
}

mainfunc._initMod(utils)

export default mainfunc
