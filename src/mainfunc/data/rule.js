import _utils from './utils'

let rule = {
  base: {
    num: '0-9',
    letter: {
      small: 'a-z',
      big: 'A-Z'
    },
    text: '\u4e00-\u9fa5',
    bd: {
      z: '，。？！‘’”“<>%',
      y: ',.?!\'\'""《》%'
    }
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
    },
    text: {
      init: ['text']
    },
    letterAndNum: {
      init: ['letter', 'num']
    },
    letterAndNumAndText: {
      init: ['text', 'letter', 'num']
    }
  }
}

rule.init = function () {
  for (let n in this.data) {
    let item = this.data[n]
    if (item.init) {
      this.data[n] = this.build(item)
    }
  }
}

rule.build = function(item) {
  let data = {
    method: 'reg'
  }
  if (item.start === undefined) {
    item.start = '^'
  }
  if (item.end === undefined) {
    item.end = '$'
  }
  let regData = this.buildNext(item.init, this.base)
  regData = item.start + '[' + regData + ']{1,}' + item.end
  data.data = new RegExp(regData)
  return data
}

rule.buildNext = function(propList, data) {
  let regStr = ''
  if (propList === true) {
    for (let n in data) {
      let info = data[n]
      if (_utils.getType(info) == 'object') {
        regStr += this.buildNext(true, info)
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
          regStr += this.buildNext(_utils.getType(prop) == 'array' ? prop : true, info)
        } else {
          regStr += info
        }
      }
    }
  }
  return regStr
}

rule.check = function(data, option) {
  let type = _utils.getType(option)
  if (type != 'object') {
    option = {
      prop: option
    }
  }
  if (!option.type) {
    option.type = 'prop'
  }
  let ruleItem
  if (option.type == 'build') {
    ruleItem = this.build(option)
  } else {
    ruleItem = this.data[option.prop]
  }
  console.log(ruleItem)
  let fg = ruleItem.data.test(data)
  if (fg) {
    if (option.size) {
      let dataSize = data.length
      if (dataSize < option.size.min || dataSize > option.size.max) {
        fg = false
      }
    }
  }
  return fg
}

rule.init()

export default rule
