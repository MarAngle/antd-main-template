import _func from '@/maindata/func/index'

class InterfaceData {
  constructor (initdata) {
    this.data = {
      default: undefined
    }
    if (initdata) {
      this.initMain(initdata)
    }
  }
  initMain (initdata) {
    let type = _func.getType(initdata)
    if (type !== 'object') {
      this.data.default = initdata
    } else {
      for (let n in initdata) {
        this.setData(n, initdata[n])
      }
    }
  }
  setData (prop, data) {
    this.data[prop] = data
  }
  getData (prop) {
    return prop ? this.data[prop] || this.data.default : this.data.default
  }
  getMain () {
    return this.data
  }
  toString () {
    return this.data.default
  }
}

export default InterfaceData
