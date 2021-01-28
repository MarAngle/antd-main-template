import Require from './build/Require'
import _environment from './data/environment'
import _utils from './data/utils'
import _notice from '@/mainnotice/index'

let mainfunc = {
  BASEDATA: {}
}

mainfunc._initMod = function (mod, funcList) {
  if (funcList) {
    for (let i in funcList) {
      let funcName = funcList[i]
      this._appendFunc(funcName, mod[funcName], mod)
    }
  } else {
    for (let n in mod) {
      if (typeof mod[n] == 'function') {
        this._appendFunc(n, mod[n], mod)
      }
    }
  }
}

mainfunc._appendFunc = function (funcName, funcData, target) {
  if (!this[funcName]) {
    if (funcData) {
      this[funcName] = funcData.bind(target)
    } else {
      console.error(`func appendFunc error: ${funcName} is not defined`)
    }
  } else {
    console.error(`func appendFunc error: ${funcName} is defined`)
  }
}

mainfunc.init = function ({ require }) {
  let requiredata = new Require(require)
  this._initMod(requiredata, ['ajax', 'require', 'get', 'post', 'postform', 'postfile', 'setToken', 'getToken', 'removeToken'])
}

mainfunc._initMod(_environment)
mainfunc._initMod(_utils)
mainfunc._initMod(_notice)

export default mainfunc
