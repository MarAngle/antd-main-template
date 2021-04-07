
import SimpleData from './../data/SimpleData'
import SearchData from './SearchData'
import PaginationData from './PaginationData'
import ChoiceData from './ChoiceData'

class ModuleData extends SimpleData {
  constructor (initdata = {}, target) {
    super()
    this.data = {}
    this.initModule(initdata, target)
  }
  initModule(initdata, target) {
    // search数据加载
    this.initSearchModule(initdata.search, target)
    // pagination数据加载
    this.initPaginationModule(initdata.pagination, target)
    // choice数据加载
    this.initChoiceModule(initdata.choice, target)
  }
  initSearchModule(initData, target) {
    if (initData) {
      initData.parent = target
    }
    this.data.search = new SearchData(initData)
    this.data.search.install(target)
  }
  initPaginationModule(initData, target) {
    this.data.pagination = new PaginationData(initData)
    this.data.pagination.install(target)
  }
  initChoiceModule(initData, target) {
    this.data.choice = new ChoiceData(initData)
    this.data.choice.install(target)
  }
  getModule(prop) {
    return this.data[prop]
  }
}

export default ModuleData
