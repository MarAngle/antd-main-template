import _func from '@/maindata/func/index'
import DefaultData from './../data/DefaultData'

class ChoiceData extends DefaultData {
  constructor (initdata = {}) {
    super(initdata)
    this.status = {
      show: false
    }
    this.data = {
      id: [],
      list: []
    }
    this.resetOption = {
      load: false,
      reload: false,
      update: false,
      search: {
        set: true,
        reset: true
      },
      page: false
    }
    this.option = {}
    this.checkInit(initdata)
  }
  checkInit(initdata = {}) {
    if (initdata.show) {
      this.setShow(true)
      this.initChoiceData(initdata)
    }
  }
  setShow(data = false) {
    this.status.show = data
  }
  getShow() {
    return this.status.show
  }
  initChoiceData(initdata = {}) {
    if (initdata.reset) {
      for (let n in initdata.reset) {
        this.resetOption[n] = initdata.reset[n]
      }
    }
    if (initdata.option) {
      this.option = initdata.option
    }
  }
  getOption() {
    return this.option
  }
  getData(prop) {
    if (prop) {
      return this.data[prop]
    } else {
      return this.data
    }
  }
  getItemFromList() {

  }
  // 数据变更=>id作为唯一基准
  changeData(idList, currentList, idProp = 'id') {
    let totalList = currentList
    for (let n = 0; n < this.data.list.length; n++) {
      let item = this.data.list[n]
      if (totalList.indexOf(item) < 0) {
        totalList.push(item)
      }
    }
    for (let i = 0; i < idList.length; i++) {
      let id = idList[i]
    }
    // this.data.id = idList
    // this.data.list = list
  }
  setData(idList, list) {
    this.data.id = idList
    this.data.list = list
  }
  autoReset(option, defaultOption) {
    option = this.formatResetOption(option, defaultOption)
    let force = this.checkReset(option)
    this.reset(force)
  }
  formatResetOption(option, defaultOption = 'load') {
    if (!option) {
      option = defaultOption
    }
    if (typeof option != 'object') {
      option = {
        from: option
      }
    }
    return option
  }
  checkReset(option = {}) {
    let from = option.from
    let reset
    if (this.resetOption[from] !== undefined) {
      if (this.resetOption[from] && typeof this.resetOption[from] == 'object') {
        let act = option.act
        if (!act) {
          this._printInfo(`checkReset函数中对应的from:${from}未定义act,可定义:${this.resetOption[from].keys()}`)
        } else if (this.resetOption[from][act] !== undefined) {
          reset = this.resetOption[from][act]
        } else {
          this._printInfo(`checkReset函数中对应的from:${from}中不存在act:${act},可定义:${this.resetOption[from].keys()}`)
        }
      } else {
        reset = this.resetOption[from]
      }
    } else {
      this._printInfo(`checkReset函数未找到对应的from:${from}`)
    }
    return reset
  }
  reset(force) {
    if (force) {
      this.setData([], [])
    }
  }
}

export default ChoiceData
