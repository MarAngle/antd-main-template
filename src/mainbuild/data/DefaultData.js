import _func from '@/maindata/func/index'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import ExtraData from './../mod/ExtraData'
import ParentData from './../mod/ParentData'

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
      prop: 'name',
      type: 'string',
      describe: '名称'
    },
    {
      prop: 'prop',
      type: 'string',
      describe: '属性'
    },
    {
      prop: 'data',
      type: 'object',
      describe: 'data数据对象'
    },
    {
      prop: 'func',
      type: 'object',
      describe: 'func函数列表'
    },
    {
      prop: 'module',
      extend: 'ModuleData',
      describe: '模块数据',
      data: [
        {
          prop: 'extra',
          extend: 'ExtraData',
          describe: '属性'
        },
        {
          prop: 'parent',
          extend: 'ParentData',
          describe: '属性'
        }
      ]
    }
  ],
  method: []
}

class DefaultData extends SimpleData {
  constructor (initdata = {}) {
    super()
    this.module = new ModuleData({
      extra: new ExtraData(),
      parent: new ParentData()
    }, this)
    this.initDefaultData(initdata)
  }
  initDefaultData ({ name, prop, data, parent, extra, func, methods }) {
    this.name = name || ''
    this.prop = prop || ''
    this._initData(data)
    this.setParent(parent)
    this.initExtra(extra)
    this.initFunc(func)
    this.initMethods(methods)
  }
  _initData(data) {
    if (data) {
      this.data = data
    }
  }
  // 加载func中的函数
  initFunc (func) {
    this.func = {}
    for (let n in func) {
      this.func[n] = func[n].bind(this)
    }
  }
  // 挂载方法
  initMethods (methods) {
    for (let n in methods) {
      let build = true
      if (this[n]) {
        let type = _func.getType(this[n])
        if (type !== 'function') {
          this.printInfo(`自定义函数${n}存在同名属性，未生效!`)
          build = false
        } else {
          this.printInfo(`method:${n}已被改写!`, 'warn')
        }
      }
      if (build) {
        this[n] = methods[n]
      }
    }
  }
  // 模块加载相关
  initModule(data) {
    return this.module.initData(data)
  }
  setModule(prop, data) {
    return this.module.setData(prop, data)
  }
  getModule(prop) {
    return this.module.getData(prop)
  }
  //
  // --- 父数据相关 --- //
  // 设置父实例
  setParent (data) {
    this.getModule('parent').setData(data)
  }
  // 获取上级实例
  getParent (n) {
    return this.getModule('parent').getData(n)
  }
  // --额外数据相关--*/
  // 加载额外数据
  initExtra (extraData) {
    if (extraData) {
      let fg = this.getModule('extra').initData(extraData)
      if (!fg) {
        this.printInfo(`设置ExtrData出错`)
      }
    }
  }
  // 设置额外数据
  setExtra (prop, data) {
    this.getModule('extra').setData(prop, data)
  }
  // 获取额外数据
  getExtra (prop) {
    return this.getModule('extra').getData(prop)
  }
  // 清除额外数据
  clearExtra (prop) {
    this.getModule('extra').clearData(prop)
  }
  // 重置额外数据
  resetExtra () {
    this.getModule('extra').reset()
  }
  selfName () {
    let parent = this.getParent()
    let pre
    if (parent && parent.selfName) {
      pre = `(${parent.selfName()})-`
    }
    if (!pre) {
      pre = ``
    }
    return `{${pre}[${this.constructor.name}-${this.name}/${this.prop}]}`
  }
}

DefaultData.buildInstrcution(instrcutionData, 'SimpleData')

console.log(DefaultData.getInstrcution('data'))

export default DefaultData
