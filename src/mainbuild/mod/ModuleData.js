class ModuleData {
  constructor (initdata) {
    this.data = {}
    this.initData(initdata)
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
  }
  getData(prop) {
    return this.data[prop]
  }
}

export default ModuleData
