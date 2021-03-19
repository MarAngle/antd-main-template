import ComplexData from './ComplexData'
import SearchData from './../mod/SearchData'

class ComplexDataWithSearch extends ComplexData {
  constructor (initdata = {}) {
    super(initdata)
    this._initComplexDataWithSearch(initdata)
    this._initComplexDataWithSearchLife()
  }
  _initComplexDataWithSearch ({ searchdata }) {
    if (searchdata) {
      searchdata.parent = this
    }
    this.searchdata = new SearchData(searchdata)
  }
  _initComplexDataWithSearchLife () {
    this.setLifeData({
      type: 'reseted',
      func: () => {
        this.resetComplexDataWithSearch()
      }
    })
  }
  setSearch () {
    this.searchdata.setData()
  }
  resetSearch (option) {
    this.searchdata.resetData('reset', option)
  }
  getSearch () {
    return this.searchdata.getData()
  }
  resetComplexDataWithSearch () {
    this.resetSearch()
  }
}

export default ComplexDataWithSearch
