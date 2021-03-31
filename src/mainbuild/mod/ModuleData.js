class ModuleData {
  constructor (initdata = {}) {
    this.data = {}
  }
  setModule(prop, data) {
    this.data[prop] = data
  }
  getModule(prop) {
    return this.data[prop]
  }
}

export default ModuleData
