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
    this.merge = this.formatMerge(initdata.merge)
  }
  formatMerge(mergeData) {
    if (mergeData) {
      if (mergeData === true) {
        mergeData = {}
      }
      if (!mergeData.limit) {
        mergeData.limit = {}
      }
      if (mergeData.limit.start === undefined) {
        mergeData.limit.start = '^'
      }
      if (mergeData.limit.end === undefined) {
        mergeData.limit.end = '$'
      }
      if (!mergeData.num) {
        mergeData.num = {}
      }
      if (mergeData.num.min === undefined) {
        mergeData.num.min = '1'
      }
      if (mergeData.num.max === undefined) {
        mergeData.num.max = ''
      }
    }
    return mergeData
  }
  buildRegStr(regData, mergeData) {
    return `${mergeData.limit.start}[${regData}]{${mergeData.num.min},${mergeData.num.max}}${mergeData.limit.end}`
  }
  buildReg(regData, mergeData) {
    return new RegExp(this.buildRegStr(regData, mergeData))
  }
  buildData(initdata) {
    if (this.type == 'reg') {
      if (initdata.merge === undefined) {
        initdata.merge = true
      }
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
          regStr += this.buildRegData(true, info)
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
            regStr += this.buildRegData(_utils.getType(prop) == 'array' ? prop : true, info)
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
      if (option.merge) {
        option.merge = this.formatMerge(option.merge)
      }
      let merge = option.merge || this.merge
      if (merge) {
        reg = this.buildReg(reg, merge)
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
