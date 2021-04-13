import _utils from './utils'
import RuleData from './../build/RuleData'

let rule = {
  data: {
    mobile: new RuleData({
      type: 'reg',
      data: /^((\+?86)|(\(\+86\)))?1\d{10}$/
    }),
    integer: new RuleData({
      build: ['num']
    }),
    num: new RuleData({
      type: 'reg',
      data: /^(-|\+)?\d+(\.\d+)?$/
    }),
    letter: new RuleData({
      build: ['letter']
    }),
    text: new RuleData({
      build: ['text']
    }),
    letterAndNum: new RuleData({
      build: ['letter', 'num']
    }),
    letterAndNumAndText: new RuleData({
      build: ['text', 'letter', 'num']
    })
  }
}

console.log(rule.data)

console.log(rule.data.letter.check('1233'))

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

export default rule
