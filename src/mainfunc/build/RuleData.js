import _utils from './../data/utils'

const base = {
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
}

// 规则校验数据
class RuleData {
  constructor (initdata) {
    if (initdata) {
      this.initMain(initdata)
    }
  }
  initMain(initdata) {
    if (!initdata) {
      this._printInfo('init无参数!')
      return false
    }
    // 类型
    this.type = initdata.type || 'reg'
    if (initdata.build) {
      this.buildData(initdata)
    } else {
      this.data = initdata.data
    }
    // 是否组合模式
    this.compose = this.formatCompose(initdata.compose)
  }
  formatCompose(composeData) {
    if (composeData) {
      if (composeData === true) {
        composeData = {}
      }
      if (!composeData.limit) {
        composeData.limit = {}
      }
      if (composeData.limit.start === undefined) {
        composeData.limit.start = '^'
      }
      if (composeData.limit.end === undefined) {
        composeData.limit.end = '$'
      }
      if (!composeData.num) {
        composeData.num = {}
      }
      if (composeData.num.min === undefined) {
        composeData.num.min = '1'
      }
      if (composeData.num.max === undefined) {
        composeData.num.max = ''
      }
    }
    return composeData
  }
  buildRegStr(regData, composeData) {
    return `${composeData.limit.start}[${regData}]{${composeData.num.min},${composeData.num.max}}${composeData.limit.start}`
  }
  buildData(initdata) {
    initdata.compose = true
    if (this.type == 'reg') {
      let regData = this.buildRegData(initdata.build, base)
      this.data = regData
    }
  }
  buildRegData(propList, data) {
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
  check(data, option = {}) {
    if (this.type == 'reg') {
      let reg = this.data
      if (option.compose) {
        option.compose = this.formatCompose(option.compose)
      }
      let compose = option.compose || this.compose
      if (compose) {
        reg = this.buildRegStr(reg, compose)
      }
      let type = _utils.getType(reg)
      if (type != 'reg') {
        reg = new RegExp(reg)
      }
      return reg.test(data)
    } else if (this.type == 'func') {
      return this.data(data, option)
    }
  }
  _printInfo(info, type = 'error') {
    console[type](this._selfName() + ':' + info)
  }
  _selfName() {
    return `[${this.constructor.name}]`
  }
}
export default RuleData
