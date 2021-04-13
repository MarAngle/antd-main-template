
class InstrcutionData {
  constructor(initdata, extendsData) {
    this.extendsData = extendsData
    this.build = {}
    this.data = {}
    if (initdata) {
      this.initData(initdata)
    }
  }
  initData({ name, build, data }) {
    this.setName(name)
    this.setBuild(build, this.build)
    this.setData(data, this.data)
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
        class: originitem.class,
        describe: originitem.describe
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
