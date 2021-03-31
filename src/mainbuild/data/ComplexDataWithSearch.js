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
    this.setModule('search', new SearchData(searchdata))
  }
  _initComplexDataWithSearchLife () {
    this.setLifeData({
      type: 'reseted',
      func: () => {
        this.getModule('search').reset()
      }
    })
  }
  setSearch (type) {
    this.getModule('search').setData(type)
  }
  resetSearch (option, syncPost, type) {
    this.getModule('search').resetFormData('reset', option, syncPost, type)
  }
  getSearch (type, deep) {
    return this.getModule('search').getData(type, deep)
  }
}

export default ComplexDataWithSearch
