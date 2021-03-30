import ComplexData from './ComplexData'
import ModuleData from './../mod/ModuleData'

class ComplexDataWithSearch extends ComplexData {
  constructor (initdata = {}) {
    super(initdata)
    this.module = new ModuleData(initdata, this)
    // this._initComplexDataWithSearch(initdata)
    // this._initComplexDataWithSearchLife()
  }
  _initComplexDataWithSearch ({ searchdata }) {
    if (searchdata) {
      searchdata.parent = this
    }
    this.searchData = new SearchData(searchdata)
  }
  _initComplexDataWithSearchLife () {
    this.setLifeData({
      type: 'reseted',
      func: () => {
        this.searchData.reset()
      }
    })
  }
  setSearch (type) {
    this.searchData.setData(type)
  }
  resetSearch (option, syncPost, type) {
    this.searchData.resetFormData('reset', option, syncPost, type)
  }
  getSearch (type, deep) {
    return this.searchData.getData(type, deep)
  }
}

export default ComplexDataWithSearch
