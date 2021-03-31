class ModuleData {
  constructor (initdata, parent) {
    this.data = {}
    this.initData(initdata)
    this.setParent(parent)
  }
  setParent(parent) {
    this.parent = parent
  }
  getParent() {
    return this.parent
  }
  initData(initdata) {
    if (initdata && typeof initdata == 'object') {
      for (let n in initdata) {
        this.setData(n, initdata[n])
      }
    }
  }
  setData(prop, data) {
    this.data[prop] = data
    if (data.install) {
      data.install(this.getParent())
    }
  }
  getData(prop) {
    return this.data[prop]
  }
}

export default ModuleData
