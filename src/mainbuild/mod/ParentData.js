class ParentData {
  constructor (parentData = {}) {
    this.data = null
    this._initMain(parentData)
  }
  _initMain (parentData) {
    if (parentData) {
      this.data = parentData
    }
  }
  setData (data) {
    this.data = data
  }
  getData (deepLevel = 1) {
    let current = this.getDataNext(this, deepLevel)
    return current
  }
  getDataNext (target, deepLevel) {
    if (target) {
      let res = target.data
      deepLevel--
      if (deepLevel > 0) {
        return this.getDataNext(res.parentdata, deepLevel)
      } else {
        return res
      }
    } else {
      return false
    }
  }
  _selfName () {
    return `[${this.constructor.name}]`
  }
}

export default ParentData
