
import SearchData from './SearchData'
import PaginationData from './PaginationData'
import ChoiceData from './ChoiceData'

class ModuleData {
  constructor (initdata = {}, target) {
    this.data = {}
    this.initModule(initdata, target)
  }
  initModule(initdata, target) {
    // search数据加载
    this.initSearchModule(initdata.search, target)
    // pagination数据加载
    this.initPaginationModule(initdata.pagination, target)
  }
  initSearchModule(initData, target) {
    if (initData) {
      initData.parent = target
    }
    this.data.search = new SearchData(initData)
    this.data.search.install(target)
  }
  initPaginationModule(initData, target) {
    if (initData) {
      this.data.pagination = new PaginationData(initData)
      this.data.pagination.install(target)
    } else {
      this.data.pagination = {
        getter: () => {
          this._printInfo('err')
          return null
        }
      }
    }
  }
  getModule(prop) {
    return this.data[prop]
  }
}

export default ModuleData
