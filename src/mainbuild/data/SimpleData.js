import InstrcutionData from './../mod/InstrcutionData'

const instrcutionData = {
  build: [],
  data: [
    {
      prop: '$LocalTempData',
      type: 'object',
      describe: '全局缓存保存字段'
    },
    {
      prop: '_getPrintInfo',
      type: 'function',
      describe: '输出信息生成函数'
    },
    {
      prop: '_printInfo',
      type: 'function',
      describe: '信息输出函数'
    },
    {
      prop: '_selfName',
      type: 'function',
      describe: '名称获取函数'
    }
  ]
}

class SimpleData {
  constructor() {
    this.$LocalTempData = {}
  }
  _getPrintInfo (content) {
    return `${this._selfName()}:${content}`
  }
  _printInfo (content, type = 'error', nextContent, nextType = type) {
    console[type](this._getPrintInfo(content))
    if (nextContent) {
      console[nextType](nextContent)
    }
  }
  _selfName () {
    return `[CLASS:${this.constructor.name}]`
  }
}

SimpleData.$instrcution = new InstrcutionData(instrcutionData)

SimpleData.buildInstrcution = function(data) {
  this.$instrcution.setData(data)
}

console.log(SimpleData.$instrcution)

export default SimpleData
