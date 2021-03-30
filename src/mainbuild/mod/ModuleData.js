
import ExtraData from './../mod/ExtraData'
import ParentData from './../mod/ParentData'

const dict = {
  list: [
    {
      originProp: 'extra',
      prop: 'extra',
      FUNC: ExtraData,
      build: true
    }
    // {
    //   originProp: 'parent',
    //   prop: 'parent',
    //   FUNC: ParentData,
    //   build: true
    // }
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
}

export default ModuleData
