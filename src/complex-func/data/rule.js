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

rule.build = function(option, prop) {
  let ruleItem = new RuleData(option)
  if (prop) {
    this.data[prop] = ruleItem
  }
  return ruleItem
}

rule.check = function(data, prop, ...args) {
  let ruleItem = this.data[prop]
  if (ruleItem) {
    return ruleItem.check(data, ...args)
  } else {
    console.error(`rule不存在${prop}校验规则，请检查代码`)
    return null
  }
}

export default rule
