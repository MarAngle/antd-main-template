import _func from '@/maindata/func/index'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'
import PaginationData from './../mod/PaginationData'

class ListData extends ComplexDataWithSearch {
  constructor (initdata = {}) {
    super(initdata)
    this.option.addStruct('list', {
      choice: {
        show: false,
        reset: 'reset',
        force: false
      }
    })
    this.choice = {
      idlist: [],
      itemlist: []
    }
    this._initListData(initdata)
  }
  _initListData ({ option, pagination }) {
    this._initListDataOption(option)
    this._initPagination(pagination)
    this._initListDataLife()
  }
  // 加载生命周期
  _initListDataLife () {
    this.setLifeData({
      type: 'beforeLoad',
      func: () => {
        this.resetChoice() // 根据情况重置选择框
      }
    })
    this.setLifeData({
      type: 'loaded',
      func: () => {
        // 加载完成操作，判断重置强制选择设置
        this.loadNextCallBack()
      }
    })
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
      if (option.list) {
        this.option.setData('list', option.list)
      }
    }
  }
  // 加载分页器
  _initPagination (pagination) {
    if (pagination) {
      this.pagination = new PaginationData(pagination)
    } else {
      this.pagination = false
    }
  }
  // 获取分页器数据
  getPageData (prop) {
    let res
    if (this.pagination) {
      if (prop == 'page') {
        res = this.pagination.getPage()
      } else if (prop == 'size') {
        res = this.pagination.getSize()
      } else if (prop == 'num') {
        res = this.pagination.getTotal()
      } else {
        res = this.pagination.getCurrent()
      }
    }
    return res
  }
  // 重置分页器
  resetPageData () {
    if (this.pagination) {
      this.pagination.reset()
    }
  }
  // 设置分页器数据
  setPageData (data, prop = 'page') {
    if (this.pagination) {
      if (prop == 'page') {
        this.pagination.setPage(data)
      } else if (prop == 'size') {
        this.pagination.setSize(data) // { page, size }
      } else if (prop == 'num') {
        this.pagination.setTotal(data)
      }
    }
  }
  // 格式化列表数据
  formatData (datalist = [], totalnum, type, option) {
    this.formatListData(this.data.list, datalist, type, option)
    this.setPageData(totalnum, 'num')
  }
  // 重新拉取数据
  reloadData (option, payload, ingForce) {
    return new Promise((resolve, reject) => {
      let type = _func.getType(option)
      if (option) {
        if (type != 'object') {
          option = {
            pageprop: 'page',
            pagedata: 1,
            choicereset: true
          }
        } else {
          if (option.choicereset === undefined) {
            option.choicereset = true
          }
        }
      } else {
        option = {
          choicereset: true
        }
      }
      if (this.pagination && option.pageprop && option.pagedata) {
        this.setPageData(option.pagedata, option.pageprop)
      }
      this.choiceForceByAct('set', option.choicereset)
      this.loadData(true, payload, ingForce).then(res => {
        resolve(res)
      }, err => {
        reject(err)
        console.error(err)
      })
    })
  }
  loadNextCallBack () {
    this.choiceForceByAct('set', false) // 选择框强制判断值在完成拉去后重置为否
  }
  // 设置choice选项
  choiceForceByAct (act, data) {
    let optionList = this.option.getData('list')
    if (act == 'set') {
      optionList.choice.force = data
    } else if (act == 'get') {
      return optionList.choice.force
    }
  }
  // 重置选择项
  resetChoice (force) {
    let optionList = this.option.getData('list')
    if (force || optionList.choice.reset || this.choiceForceByAct('get')) {
      this.setChoice([], [])
    }
  }
  // 从列表获取数据并从数组删除数据
  getTotalChoiceItem (id, totallist) {
    for (let n in totallist) {
      let item = totallist[n]
      if (item && item[this.dictionary.getIdProp()] == id) {
        totallist.splice(n, 1)
        return item
      }
    }
    return false
  }
  // 重新计算idlist
  recountChoice (idlist, currentlist) {
    let list = []
    let totallist = this.choice.itemlist
    for (let n = 0; n < currentlist.length; n++) {
      let item = currentlist[n]
      if (totallist.indexOf(item) < 0) {
        totallist.push(item)
      }
    }
    for (let n = 0; n < idlist.length; n++) {
      let itemid = idlist[n]
      list[n] = this.getTotalChoiceItem(itemid, totallist)
    }
    this.setChoice(idlist, list)
  }
  // 设置选项
  setChoice (idlist, itemlist) {
    this.choice.idlist = idlist
    this.choice.itemlist = itemlist
  }
  // 获取选项
  getChoice (prop) {
    if (prop) {
      return this.choice[prop]
    } else {
      return this.choice
    }
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
