
class InstrcutionData {
  constructor(initdata) {
    this.data = {
      build: new Map(),
      data: new Map()
    }
    if (initdata) {
      this.setData(initdata)
    }
  }
  setData({ build, data }) {
    this.setDataNext(build, this.data.build)
    this.setDataNext(data, this.data.data)
  }
  setDataNext(list, data) {
    for (let n = 0; n < list.length; n++) {
      let originitem = list[n]
      let item = {
        prop: originitem.prop,
        type: originitem.type,
        describe: originitem.describe
      }
      data.set(originitem.prop, item)
      if (originitem.data) {
        item.data = new Map()
        this.setDataNext(originitem.data, item.data)
      }
    }
  }
}
export default InstrcutionData
