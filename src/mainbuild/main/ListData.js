import _func from '@/maindata/func/index'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'
import ChoiceData from './../mod/ChoiceData'

class ListData extends ComplexDataWithSearch {
  constructor (initdata = {}) {
    super(initdata)
    this.module.choice = new ChoiceData(initdata.choice)
    this._initListData(initdata)
  }
  _initListData ({ option, pagination }) {
    this._initListDataOption(option)
    this._initListDataLife()
  }
  // 加载生命周期
  _initListDataLife () {
    this.setLifeData({
      type: 'reseted',
      func: () => {
        this.resetListData()
      }
    })
  }
  // 加载设置项
  _initListDataOption (option) {
    if (option) {
    }
  }
  // 格式化列表数据
  formatData (datalist = [], totalnum, type, option) {
    this.formatListData(this.data.list, datalist, type, option)
    this.setPageData(totalnum, 'num')
  }
  // 数据重新拉取
  reloadData (page, choice, force, ...args) {
    return new Promise((resolve, reject) => {
      let type = _func.getType(page)
      if (page) {
        if (type != 'object') {
          page = {
            prop: 'page',
            data: 1
          }
        }
        if (this.module.data.pagination && page.prop && page.data) {
          this.setPageData(page.data, page.prop)
        }
      }
      // 根据设置和传值自动进行当前选项的重置操作
      this.autoChoiceReset(choice, 'reload')
      this.loadData(force, ...args).then(res => {
        resolve(res)
      }, err => {
        console.error(err)
        reject(err)
      })
    })
  }
  autoChoiceReset(data) {
    this.module.choice.autoReset(data)
  }
  changeChoice(idList, currentList, idProp) {
    if (!idProp) {
      idProp = this.getDictionaryPropData('prop', 'id')
    }
    this.module.choice.changeData(idList, currentList, idProp)
  }
  resetChoice(force) {
    this.module.choice.reset(force)
  }
  // 获取选项
  getChoice () {
    return this.module.choice
  }
  // 获取选项
  getChoiceData (prop) {
    return this.module.choice.getData(prop)
  }
  // 重置， 清除检索，清除选择项，分页器恢复，数据清除
  resetListData () {
    this.resetChoice(true)
    this.resetPageData()
  }
  // --数据相关--*/
  // 获取对象
  getItem (data, type = 'index') {
    if (type == 'index') {
      return this.data.list[data]
    }
  }
  // 获取对象的index值
  getIndex (data) {
    return this.data.list.indexOf(data)
  }
}

export default ListData
