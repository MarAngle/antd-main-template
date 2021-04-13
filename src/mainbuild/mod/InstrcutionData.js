
const dict = {
  base: ['prop', 'describe'],
  build: {
    prop: ['type', 'required'],
    extend: true,
    data: true
  },
  data: {
    prop: ['type'],
    extend: true,
    data: true
  },
  method: {
    prop: []
  }
}

class InstrcutionData {
  constructor(initdata, instrcutionMap, extendsProp) {
    this.build = {}
    this.data = {}
    this.method = {}
    if (initdata) {
      this.initData(initdata, instrcutionMap, extendsProp)
    }
  }
  initData({ name, build = [], data = [], method = [] }, instrcutionMap, extendsProp) {
    this.setDataMap(instrcutionMap)
    this.setExtend(extendsProp)
    this.setName(name)
    this.setData(build, this.build, 'build')
    this.setData(data, this.data, 'data')
    this.setData(method, this.method, 'method')
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
  formatData(item, originitem, dictItem) {
    for (let n in dict.base) {
      let prop = dict.base[n]
      item[prop] = originitem[prop]
    }
    for (let n in dictItem.prop) {
      let prop = dictItem.prop[n]
      item[prop] = originitem[prop]
    }
  }
  setData(list, data, type) {
    for (let n = 0; n < list.length; n++) {
      let originitem = list[n]
      let dictItem = dict[type]
      let item = {}
      this.formatData(item, originitem, dictItem)
      if (dictItem.extend && originitem.extend) {
        item.extend = this.getDataMapItem(originitem.extend)
      }
      data[originitem.prop] = item
      if (dictItem.data && originitem.data) {
        item.data = {}
        this.setData(originitem.data, item.data, type)
      }
    }
  }
  getData(type) {
    let origindata = this[type]
    let data = {}
    this.getDataNext(data, origindata, type)
    return data
  }
  getDataNext(data, origindata, type) {
    for (let n in origindata) {
      data[n] = {}
      let dictItem = dict[type]
      this.formatData(data[n], origindata[n], dictItem)
      data[n].from = this.name
      // if (dictItem.extend && origindata[n].extend) {
      //   data[n].data = origindata[n].extend.getData()
      // }
      if (dictItem.data && origindata[n].data) {
        data[n].data = {}
        this.getDataNext(data[n].data, origindata[n].data, type)
      }
    }
  }
}
export default InstrcutionData
