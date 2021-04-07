import _func from '@/maindata/func/index'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'
import ChoiceData from './../mod/ChoiceData'

class TreeData extends ComplexDataWithSearch {
  constructor (initdata = {}) {
    super(initdata)
    this._initTreeData(initdata)
    this.triggerCreateLife('TreeData')
  }
  _initTreeData ({ option }) {
    this._initTreeDataOption(option)
  }
  // 加载设置项
  _initTreeDataOption (option) {
    if (option) {}
  }
  analyzeDictionaryData(dictionaryData) {
    if (dictionaryData) {
      if (!dictionaryData.option) {
        dictionaryData.option = {}
      }
      if (dictionaryData.option.tree === undefined) {
        dictionaryData.option.tree = true
      }
    }
    return dictionaryData
  }
  // 格式化列表数据
  formatData (datalist = [], type, option) {
    this.formatTreeData(this.data.list, datalist, type, option)
  }
  // 数据重新拉取
  reloadData (force, ...args) {
    return new Promise((resolve, reject) => {
      this.loadData(force, ...args).then(res => {
        resolve(res)
      }, err => {
        console.error(err)
        reject(err)
      })
    })
  }
  // --数据相关--*/
  // 获取对象
  getItem(data, prop, childProp) {
    if (!prop) {
      prop = this.getDictionaryPropData('prop', 'id')
    }
    if (!childProp) {
      childProp = this.getDictionaryPropData('prop', 'children')
    }
    return this.getItemNext(this.data.list, data, prop, childProp)
  }
  getItemNext(list, data, prop, childProp) {
    if (!prop) {
      prop = this.getDictionaryPropData('prop', 'id')
    }
    if (!childProp) {
      childProp = this.getDictionaryPropData('prop', 'children')
    }
    for (let n in list) {
      let item = list[n]
      if (item[prop] == data) {
        return item
      } else if (item[childProp]) {
        let res = this.getItemNext(item[childProp], data, prop, childProp)
        if (res) {
          return res
        }
      }
    }
    return false
  }
}

export default TreeData
