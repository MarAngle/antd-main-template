import _func from '@/maindata/func/index'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'
import PaginationData from './../mod/PaginationData'
import ChoiceData from './../mod/ChoiceData'

class ListData extends ComplexDataWithSearch {
  constructor (initdata = {}) {
    super(initdata)
    this.module.choice = new ChoiceData(initdata.choice)
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
      func: (...args) => {
        console.log(args)
        // this.resetChoice() // 根据情况重置选择框
      }
    })
    this.setLifeData({
      type: 'loaded',
      func: (...args) => {
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
      // if (option.list) {
      //   this.option.setData('list', option.list)
      // }
    }
  }
  // 加载分页器
  _initPagination (pagination) {
    if (pagination) {
      this.module.pagination = new PaginationData(pagination)
    } else {
      this.module.pagination = null
    }
  }
  // 获取分页器数据
  getPageData (prop) {
    let res
    if (this.module.pagination) {
      if (prop == 'page') {
        res = this.module.pagination.getPage()
      } else if (prop == 'size') {
        res = this.module.pagination.getSize()
      } else if (prop == 'num') {
        res = this.module.pagination.getTotal()
      } else {
        res = this.module.pagination.getCurrent()
      }
    }
    return res
  }
  // 重置分页器
  resetPageData () {
    if (this.module.pagination) {
      this.module.pagination.reset()
    }
  }
  // 设置分页器数据
  setPageData (data, prop = 'page') {
    if (this.module.pagination) {
      if (prop == 'page') {
        this.module.pagination.setPage(data)
      } else if (prop == 'size') {
        this.module.pagination.setSize(data) // { page, size }
      } else if (prop == 'num') {
        this.module.pagination.setTotal(data)
      }
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
      } else {
        page = {
          // choicereset: true
        }
      }
      if (this.module.pagination && page.prop && page.data) {
        this.setPageData(page.data, page.prop)
      }
      choice = this.formatChoiceOption(choice, 'reload')
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
  // 设置choice选项
  // choiceForceByAct (act, data) {
  //   let optionList = this.option.getData('list')
  //   if (act == 'set') {
  //     optionList.choice.force = data
  //   } else if (act == 'get') {
  //     return optionList.choice.force
  //   }
  // }
  autoChoiceReset(data) {
    this.module.choice.autoReset(data)
  }
  changeChoice(id, list) {
    this.module.choice.changeData(id, list)
  }
  resetChoice(force) {
    this.module.choice.reset(force)
  }
  // 重置选择项
  // resetChoice (force) {
  //   let optionList = this.option.getData('list')
  //   if (force || optionList.choice.reset || this.choiceForceByAct('get')) {
  //     this.setChoice([], [])
  //   }
  // }
  // // 从列表获取数据并从数组删除数据
  // getTotalChoiceItem (id, totallist) {
  //   for (let n in totallist) {
  //     let item = totallist[n]
  //     if (item && item[this.dictionary.getIdProp()] == id) {
  //       totallist.splice(n, 1)
  //       return item
  //     }
  //   }
  //   return false
  // }
  // // 重新计算idlist
  // recountChoice (idlist, currentlist) {
  //   let list = []
  //   let totallist = this.choice.itemlist
  //   for (let n = 0; n < currentlist.length; n++) {
  //     let item = currentlist[n]
  //     if (totallist.indexOf(item) < 0) {
  //       totallist.push(item)
  //     }
  //   }
  //   for (let n = 0; n < idlist.length; n++) {
  //     let itemid = idlist[n]
  //     list[n] = this.getTotalChoiceItem(itemid, totallist)
  //   }
  //   this.setChoice(idlist, list)
  // }
  // // 设置选项
  // setChoice (idlist, itemlist) {
  //   this.choice.idlist = idlist
  //   this.choice.itemlist = itemlist
  // }
  // // 获取选项
  // getChoice (prop) {
  //   if (prop) {
  //     return this.choice[prop]
  //   } else {
  //     return this.choice
  //   }
  // }
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
