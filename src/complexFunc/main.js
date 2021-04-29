import Require from './build/Require'
import environment from './data/environment'
import rule from './data/rule'
import utils from './data/utils'
import notice from '@/mainnotice/index'

let mainfunc = {
  data: {}
}

mainfunc._initMod = function (mod, methodList) {
  if (methodList) {
    for (let i in methodList) {
      let methodData = methodList[i]
      if (typeof methodData != 'object') {
        methodData = {
          originprop: methodData,
          prop: methodData,
          replace: false
        }
      }
      this._appendMethod(methodData.prop, mod[methodData.originprop], mod, methodData.replace)
    }
  } else {
    for (let n in mod) {
      if (typeof mod[n] == 'function') {
        this._appendMethod(n, mod[n], mod)
      }
    }
  }
}

mainfunc._appendMethod = function (methodName, methodData, target, replace = false) {
  let append = false
  if (!this[methodName]) {
    append = true
  } else if (replace) {
    append = true
    console.warn(`func appendMethod warn: ${methodName} is replace`)
  } else {
    console.error(`func appendMethod error: ${methodName} is defined`)
  }
  if (append) {
    if (methodData) {
      if (target) {
        this[methodName] = methodData.bind(target)
      } else {
        this[methodName] = methodData
      }
    } else {
      console.error(`func appendMethod error: ${methodName} data is not defined`)
    }
  }
}

mainfunc.initRequire = function (require) {
  let requiredata = new Require(require)
  this._initMod(requiredata, ['ajax', 'require', 'get', 'post', 'postform', 'postfile', 'setToken', 'getToken', 'removeToken'])
}

mainfunc._initMod(environment)
mainfunc._initMod(rule, [
  {
    originprop: 'check',
    prop: 'checkRule'
  },
  {
    originprop: 'build',
    prop: 'buildRule'
  }
])
mainfunc._initMod(utils)
mainfunc._initMod(notice)

export default mainfunc
