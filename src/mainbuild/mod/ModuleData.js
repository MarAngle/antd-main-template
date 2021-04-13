import SimpleData from './../data/SimpleData'

const instrcutionData = {
  build: [
    {
      prop: 'initdata',
      type: 'object',
      describe: '构建参数',
      required: true,
      data: [
        {
          prop: 'name',
          type: 'string',
          required: false,
          describe: '名称'
        },
        {
          prop: 'prop',
          type: 'string',
          required: false,
          describe: '属性'
        },
        {
          prop: 'data',
          type: 'object',
          required: false,
          describe: 'data属性赋值'
        },
        {
          prop: 'parent',
          type: 'object',
          required: false,
          describe: '父数据'
        },
        {
          prop: 'extra',
          type: 'object',
          required: false,
          describe: 'extra数据'
        },
        {
          prop: 'func',
          type: 'object',
          required: false,
          describe: 'func函数，将会挂载到跟属性func上，this指向实例'
        },
        {
          prop: 'methods',
          type: 'object',
          required: false,
          describe: 'methods函数，将会挂载到实例上，this不做操作'
        }
      ]
    }
  ],
  data: [
    {
      prop: 'data',
      type: 'object',
      describe: 'module数据保存位置'
    },
    {
      prop: 'parent',
      type: 'object',
      describe: 'parent父实例保存位置(因依赖问题此处非ParentData实例)'
    }
  ],
  method: []
}

class ModuleData extends SimpleData {
  constructor (initdata, parent) {
    super()
    this.data = {}
    this.initData(initdata)
    this.setParent(parent)
  }
  setParent(parent) {
    this.parent = parent
  }
  getParent() {
    return this.parent
  }
  initData(initdata) {
    if (initdata && typeof initdata == 'object') {
      for (let n in initdata) {
        this.setData(n, initdata[n])
      }
    }
  }
  setData(prop, data) {
    if (this.data[prop]) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (this.data[prop].uninstall) {
        this.data[prop].uninstall(this.getParent())
      }
    }
    this.data[prop] = data
    if (data.install) {
      data.install(this.getParent())
    }
  }
  getData(prop) {
    return this.data[prop]
  }
}

ModuleData.buildInstrcution(instrcutionData, 'SimpleData')

export default ModuleData
