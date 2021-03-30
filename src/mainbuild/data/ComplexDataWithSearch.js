import ComplexData from './ComplexData'
import ModuleData from './../mod/ModuleData'

class ComplexDataWithSearch extends ComplexData {
  constructor (initdata = {}) {
    super(initdata)
    this.module = new ModuleData(initdata, this)
  }
}

export default ComplexDataWithSearch
