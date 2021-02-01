import Vue from 'vue'
import _func from '@/maindata/func/index'
import BaseData from './BaseData'
import DictionaryList from './../mod/DictionaryList'
import InterfaceData from './../mod/InterfaceData'
import option from './../option'

class ComplexData extends BaseData {
  constructor (initdata = {}) {
    super(initdata)
    this.data = {
      list: [],
      tree: [],
      current: {}
    }
    /*
    build: {
      limit: [] // 存在值则对应的模块在非对象模块时不参与构建整个数据
    }
    */
    this.dictionaryList = new DictionaryList()
    this.mod = {}
    this._initComplexData(initdata)
  }
  _initComplexData ({
    option,
    originData,
    dictionary,
    layout
  }) {
    this._initLayout(layout)
    this._initOriginData(originData)
    this._initComplexDataOption(option)
    this._initDictionary(dictionary)
    this.buildModData('edit')
    this._initComplexDataLife()
  }
  // 加载生命周期函数
  _initComplexDataLife () {
    this.setLifeData({
      type: 'reseted',
      func: () => {
        this.resetComplexData()
      }
    })
  }
  // 加载源数据
  _initOriginData (originData) {
    if (originData) {
      this.originData = originData
      this.getData = function () {
        return new Promise((resolve, reject) => {
          this.formatData(this.originData)
          resolve({ status: 'success' })
        })
      }
    }
  }
  // 加载布局设置项
  _initLayout (layout) {
    if (!layout) {
      layout = {
        default: {
          main: 24,
          label: {
            span: 8
          },
          content: {
            span: 16
          }
        }
      }
    }
    this.layout = new InterfaceData(layout)
  }
  // 加载设置选项
  _initComplexDataOption (option) {
    if (option) {}
  }
  // 设置字典列表
  _initDictionary (dictionaryOption) {
    if (dictionaryOption) {
      if (dictionaryOption.constructor === DictionaryList) {
        this.dictionaryList = dictionaryOption
      } else {
        dictionaryOption = this.analyzeDictionaryOption(dictionaryOption)
        this.dictionaryList.initMain(dictionaryOption, {
          layout: this.layout.getMain(),
          parent: this
        })
      }
    }
  }
  analyzeDictionaryOption (dictionaryOption) {
    return dictionaryOption
  }
  /**
   * 根据prop生成编辑基本模板以及对应数据
   * @param {*} prop 对应的模块名称，最终挂载到mod[prop]中
   * @param {object}
   *    @param {*} mod 默认取prop，此值主要用途为从字典mod中的哪个prop作为基准进行判断
   * @param {*} rebuild 重新构建判断值
   */
  buildModData (prop, payload = {}, rebuild) {
    if (this.mod[prop] && !rebuild) {
      // 此处考虑重置数据
    } else {
      if (!payload.mod) {
        payload.mod = prop
      }
      payload.self = this
      let data = {
        modlist: [],
        mainlist: []
      }
      data.modlist = this.getModList(prop)
      data.mainlist = this.getPageList(prop, data.modlist, payload)
      option.build(data, prop, payload)
      Vue.set(this.mod, prop, data)
    }
    return this.mod[prop]
  }
  /**
   * 重新构建字典列表
   * @param {*} dictionary 字典列表构建参数
   * @param {*} payload :type 字典构建类型
   */
  rebuildDictionary (dictionaryData, payload = {}) {
    if (dictionaryData) {
      if (dictionaryData.constructor === DictionaryList) {
        this.dictionaryList = dictionaryData
      } else {
        dictionaryData = this.analyzeDictionaryOption(dictionaryData)
        this.dictionaryList.rebuildData(dictionaryData, {
          type: payload.type,
          layout: this.layout.getMain(),
          parent: this
        })
      }
    }
  }
  // 设置字典唯一值
  setIdData (data) {
    this.dictionaryList.setIdData(data)
  }
  // 获取字典唯一值
  getIdData () {
    return this.dictionaryList.getIdData()
  }
  // 生成基本的form表单数据，(originitemtype对应change或者设置的formatType=change时作为初始值参与构建)
  buildModFormData (modlist, type, originitem) {
    let targetForm = this.mod[type].form
    for (let n in modlist) {
      let ditem = modlist[n]
      let target = ditem.getFormData(type, {
        targetitem: targetForm.data,
        originitem: originitem
      })
      Vue.set(targetForm.data, ditem.prop, target)
    }
    targetForm.num++
  }
  // 根据状态获取form对应的初始值（创建和编辑）
  resetFormData (modlist, type, originitem) {
    let targetForm = this.mod.edit.form
    for (let n in modlist) {
      let ditem = modlist[n]
      let target = ditem.getFormData(type, {
        targetitem: targetForm.data,
        originitem: originitem
      })
      Vue.set(targetForm.data, ditem.prop, target)
    }
    targetForm.num++
  }
  // 获取字典对象
  getDitem (data, act) {
    return this.dictionaryList.getItem(data, act)
  }
  // 编辑对象函数 创建和编辑，对应的函数需要在外部methods里面定义
  triggerEdit (type, tempdata, modlist, index) {
    return new Promise((resolve, reject) => {
      let postdata = this.getPostData(tempdata, modlist, type)
      if (type == 'change') {
        this.triggerChangeItem(postdata, index).then(res => {
          resolve(res)
        }, res => {
          reject(res)
        })
      } else if (type == 'build') {
        this.triggerBuildItem(postdata).then(res => {
          resolve(res)
        }, res => {
          reject(res)
        })
      }
    })
  }

  // 并在编辑的时候添加上ID字段
  setPostDataId (postdata, targetitem) {
    this.dictionaryList.setPostDataId(postdata, targetitem)
  }
  // 根据本地数据格式以及mod列表格式化为后端需要的数据格式
  getPostData (tempdata, modlist, type) {
    return this.dictionaryList.getPostData(tempdata, modlist, type)
  }
  // 根据源数据格式化对象
  formatItem (originitem, type = 'list', option) {
    return this.dictionaryList.formatItem(originitem, type, option)
  }
  // 根据源数据更新数据
  updateItem (targetitem, originitem, type = 'info', option) {
    return this.dictionaryList.updateItem(targetitem, originitem, type, option)
  }
  // 格式化列表数据
  formatListData (targetlist, originlist, type, option) {
    this.dictionaryList.formatListData(targetlist, originlist, type, option)
  }
  // 格式化列表数据
  formatTreeData (targetlist, originlist, type, option) {
    this.dictionaryList.formatTreeData(targetlist, originlist, type, option)
  }
  // 格式化独立数据
  formatItemData (originitem, targetitem, type, option = {}) {
    if (!option.type) {
      option.type = 'add'
    }
    let item = this.formatItem(originitem, type)
    _func.updateData(targetitem, item, option)
  }
  // 获取基本数据模板
  getDataTemplate (mod = 'list') {
    let data = this.updateItem({}, {}, mod)
    return data
  }

  // --编辑数据相关--
  // --页面数据相关--
  // 获取页面页面对应的字典列表
  getModList (mod) {
    return this.dictionaryList.getModList(mod)
  }
  // 根据字典列表返回页面需要的数据列表
  getPageList (mod, modlist, payload = {}) {
    return this.dictionaryList.getPageList(mod, modlist, payload)
  }

  // 触发获取详情操作
  triggerGetInfo (payload) {
    return new Promise((resolve, reject) => {
      if (this.getInfo) {
        this.triggerTargetMethod('getInfo', payload).then(res => {
          resolve(res)
        }, res => {
          reject(res)
        })
      } else {
        resolve({ status: 'success' })
      }
    })
  }
  // 触发新建数据操作
  triggerBuildItem (postdata, payload) {
    return new Promise((resolve, reject) => {
      this.triggerTargetMethod('buildItem', {
        postdata,
        payload
      }).then(res => {
        resolve(res)
      }, res => {
        reject(res)
      })
    })
  }
  // 触发修改数据操作
  triggerChangeItem (postdata, index, payload) {
    return new Promise((resolve, reject) => {
      let targetitem = this.getItem(index)
      this.setPostDataId(postdata, targetitem)
      this.triggerTargetMethod('changeItem', {
        postdata,
        index,
        targetitem,
        payload
      }).then(res => {
        resolve(res)
      }, res => {
        reject(res)
      })
    })
  }

  // 重置data.current
  resetDataCurrent () {
    this.data.current = this.getDataTemplate()
  }
  // 重置data.list
  resetDataList () {
    _func.clearArray(this.data.list)
  }
  // 重置回调
  resetComplexData () {
    this.resetDataList()
    this.resetDataCurrent()
  }
}

export default ComplexData
