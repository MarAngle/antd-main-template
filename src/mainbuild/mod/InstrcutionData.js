
class InstrcutionData {
  constructor(initdata, instrcutionMap, extendsProp) {
    this.build = {}
    this.data = {}
    if (initdata) {
      this.initData(initdata, instrcutionMap, extendsProp)
    }
  }
  initData({ name, build, data }, instrcutionMap, extendsProp) {
    this.setDataMap(instrcutionMap)
    this.setExtend(extendsProp)
    this.setName(name)
    this.setBuild(build, this.build)
    this.setData(data, this.data)
  }
  setDataMap(instrcutionMap) {
    this.dataMap = instrcutionMap
  }
  getDataMap() {
    return this.dataMap
  }
  getDataMapItem(prop) {
    let instrcutionMap = this.getDataMap()
    if (prop && instrcutionMap.has(prop)) {
      return instrcutionMap.get(prop)
    }
    return null
  }
  setExtend(extendsProp) {
    this.extend = this.getDataMapItem(extendsProp)
  }
  setName(name) {
    this.name = name
  }
  setBuild(list, data) {
    for (let n = 0; n < list.length; n++) {
      let originitem = list[n]
      let item = {
        prop: originitem.prop,
        type: originitem.type,
        required: originitem.required,
        describe: originitem.describe
      }
      if (originitem.extend) {
        item.extend = this.getDataMapItem(originitem.extend)
      }
      data[originitem.prop] = item
      if (originitem.data) {
        item.data = {}
        this.setBuild(originitem.data, item.data)
      }
    }
  }
  setData(list, data) {
    for (let n = 0; n < list.length; n++) {
      let originitem = list[n]
      let item = {
        prop: originitem.prop,
        type: originitem.type,
        describe: originitem.describe
      }
      if (originitem.extend) {
        item.extend = this.getDataMapItem(originitem.extend)
      }
      data[originitem.prop] = item
      if (originitem.data) {
        item.data = {}
        this.setData(originitem.data, item.data)
      }
    }
  }
}
export default InstrcutionData
