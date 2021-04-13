import instrcution from './../utils/instrcution'

const instrcutionData = {
  build: [],
  data: [
    {
      prop: '$LocalTempData',
      type: 'object',
      describe: '全局缓存保存字段'
    },
    {
      prop: 'getPrintInfo',
      type: 'function',
      describe: '输出信息生成函数'
    },
    {
      prop: 'printInfo',
      type: 'function',
      describe: '信息输出函数'
    },
    {
      prop: 'selfName',
      type: 'function',
      describe: '名称获取函数'
    }
  ]
}

class SimpleData {
  constructor() {
    this.$LocalTempData = {}
  }
  getPrintInfo (content) {
    return `${this.selfName()}:${content}`
  }
  printInfo (content, type = 'error', nextContent, nextType = type) {
    console[type](this.getPrintInfo(content))
    if (nextContent) {
      console[nextType](nextContent)
    }
  }
  selfName () {
    return `[CLASS:${this.constructor.name}]`
  }
}

SimpleData.buildInstrcution = function(instrcutionData, prop) {
  if (!prop) {
    prop = this.name
  }
  console.log(this.name)
  instrcution.build(instrcutionData, prop)
}

SimpleData.buildInstrcution(instrcutionData, 'SimpleData')

export default SimpleData
