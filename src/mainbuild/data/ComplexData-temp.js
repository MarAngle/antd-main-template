// import Vue from 'vue'
import _func from '@/maindata/func/index'
import BaseData from './BaseData'
import DictionaryList from './../mod/DictionaryList'

class ComplexData extends BaseData {
  constructor (initdata = {}) {
    super(initdata)
    this.data = {
      list: [],
      current: {}
    }
    /*
    build: {
      limit: [] // 存在值则对应的模块在非对象模块时不参与构建整个数据
    }
    */
    this.dictionaryList = new DictionaryList()
    this._initComplexData(initdata)
  }
  _initComplexData ({
    option,
    dictionary
  }) {
    this._initComplexDataOption(option)
    this.initDictionary(dictionary)
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
  // 加载设置选项
  _initComplexDataOption (option) {
    if (option) {}
  }
  // 设置字典列表
  initDictionary (dictionaryOption) {
    if (dictionaryOption) {
      if (dictionaryOption.constructor === DictionaryList) {
        this.dictionaryList = dictionaryOption
      } else {
        dictionaryOption = this.analyzeDictionaryOption(dictionaryOption, 'init')
        if (!dictionaryOption.parent) {
          dictionaryOption.parent = this
        }
        this.dictionaryList.initMain(dictionaryOption)
      }
    }
  }
  analyzeDictionaryOption (dictionaryOption, from) {
    return dictionaryOption
  }
  /**
   * 重新构建字典列表
   * @param {*} dictionary 字典列表构建参数
   * @param {*} payload :type 字典构建类型
   */
  rebuildDictionary (dictionaryOption, payload = {}) {
    if (dictionaryOption) {
      if (dictionaryOption.constructor === DictionaryList) {
        this.dictionaryList = dictionaryOption
      } else {
        dictionaryOption = this.analyzeDictionaryOption(dictionaryOption, 'rebuild')
        if (!dictionaryOption.parent) {
          dictionaryOption.parent = this
        }
        this.dictionaryList.rebuildData(dictionaryOption, {
          type: payload.type
        })
      }
    }
  }
  getDictionaryItem(data, from) {
    return this.dictionaryList.getItem(data, from)
  }
  // 设置字典唯一值
  setDictionaryPropData (data, target, prop) {
    this.dictionaryList.setPropData(data, target, prop)
  }
  // 获取字典唯一值
  getDictionaryPropData (target, prop) {
    return this.dictionaryList.getPropData(target, prop)
  }
  getDictionaryModList (mod) {
    return this.dictionaryList.getModList(mod)
  }
  getDictionaryPageList (mod, payload) {
    return this.dictionaryList.getPageList(mod, payload)
  }
  getDictionaryPageListByModList (mod, modlist, payload) {
    return this.dictionaryList.getPageListByModList(mod, modlist, payload)
  }
  getDictionaryFormData(modlist, mod, originitem) {
    return this.dictionaryList.getFormData(modlist, mod, originitem)
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
  // 格式化Form数据
  getEditData (formData, modlist, type) {
    return this.dictionaryList.getEditData(formData, modlist, type)
  }
}

export default ComplexData
