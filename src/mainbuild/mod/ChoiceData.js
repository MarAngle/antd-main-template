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
    this.reset = {
      load: false,
      update: false,
      search: false,
      page: false,
      pageSize: false
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
        this.reset[n] = initdata.reset[n]
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
  changeData(id, list) {
    this.data.id = id
    this.data.list = list
  }
}

export default ChoiceData
