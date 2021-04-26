import Require from './build/Require'
import _environment from './data/environment'
import _rule from './data/rule'
import _utils from './data/utils'
import _notice from '@/mainnotice/index'

// import './test/deepClone'

let mainfunc = {
  BASEDATA: {}
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
  if (!this[methodName]) {
    if (methodData) {
      this[methodName] = methodData.bind(target)
    } else {
      console.error(`func appendMethod error: ${methodName} is not defined`)
    }
  } else {
    console.error(`func appendMethod error: ${methodName} is defined`)
  }
}

mainfunc.init = function ({ require }) {
  let requiredata = new Require(require)
  this._initMod(requiredata, ['ajax', 'require', 'get', 'post', 'postform', 'postfile', 'setToken', 'getToken', 'removeToken'])
}

mainfunc._initMod(_environment)
mainfunc._initMod(_rule, [
  {
    originprop: 'check',
    prop: 'checkRule'
  },
  {
    originprop: 'build',
    prop: 'buildRule'
  }
])
mainfunc._initMod(_utils)
mainfunc._initMod(_notice)

export default mainfunc
