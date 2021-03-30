
import SearchData from './../mod/SearchData'

const dict = {
  list: [
    {
      originProp: 'search',
      prop: 'search',
      FUNC: SearchData,
      build: true
    }
  ]
}

class ModuleData {
  constructor (initdata = {}, target) {
    this.data = {}
    this.initModule(initdata, target)
  }
  initModule(initdata, target) {
    for (let n = 0; n < dict.list.length; n++) {
      let dictData = dict.list[n]
      if (dictData.build || initdata[dictData.originProp] !== undefined) {
        this.data[dictData.prop] = new dictData.FUNC(initdata[dictData.originProp])
        this.data[dictData.prop].install(target)
      }
    }
  }
  getModule(prop) {
    return this.data[prop]
  }
}

export default ModuleData
