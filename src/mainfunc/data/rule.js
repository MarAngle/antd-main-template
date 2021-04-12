import _utils from './utils'

let rule = {
  base: {
    num: '0-9',
    letter: {
      small: 'a-z',
      big: 'A-Z'
    },
    text: '\u4e00-\u9fa5'
  },
  data: {
    mobile: {
      method: 'reg',
      data: /^((\+?86)|(\(\+86\)))?1\d{10}$/
    },
    integer: {
      init: ['num']
    },
    num: {
      method: 'reg',
      data: /^(-|\+)?\d+(\.\d+)?$/
    },
    letter: {
      init: ['letter']
    }
  }
}

rule.init = function () {
  for (let n in this.data) {
    let item = this.data[n]
    if (item.init) {
      let regData = this.initNext(item.init, this.base)
      item.method = 'reg'
      if (item.start === undefined) {
        item.start = '^'
      }
      if (item.end === undefined) {
        item.end = '$'
      }
      regData = item.start + '[' + regData + ']' + item.end
      item.data = new RegExp(regData)
      console.log(item.data)
    }
  }
}

rule.initNext = function(propList, data) {
  let regStr = ''
  if (propList === true) {
    for (let n in data) {
      let info = data[n]
      if (_utils.getType(info) == 'object') {
        regStr += this.initNext(true, info)
      } else {
        regStr += info
      }
    }
  } else {
    let type = _utils.getType(propList)
    if (type == 'array') {
      for (let i = 0; i < propList.length; i++) {
        let prop = propList[i]
        let info = data[prop]
        if (_utils.getType(info) == 'object') {
          regStr += this.initNext(_utils.getType(prop) == 'array' ? prop : true, info)
        } else {
          regStr += info
        }
      }
    }
  }
  return regStr
}

rule.init()

export default rule
