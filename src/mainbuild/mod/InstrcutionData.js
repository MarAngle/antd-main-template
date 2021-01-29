
class InstrcutionData {
  constructor (initdata) {
    this.option = [] // 传参描述
    this.structure = {} // 结构描述
    this.initMain(initdata)
  }
  initMain ({ option, structure }) {
    this.initOption(option)
    this.initStructure(structure)
  }
  initOption (option) {
    this.option = []
    for (let n in option) {
      let oitem = option[n]
      let item = this.buildOptionItem(oitem)
      this.option.push(item)
    }
  }

  buildOptionItem (oitem) {
    let item = {}
    // for (let n in oitem) {
    //   if (optionData[n]) {
    //     item[n] = oitem[n]
    //   } else {
    //     item[n] = this.buildOptionItem(oitem[n])
    //   }
    // }
    // if (oitem.data) {
    //   item.data = this.buildOptionItem(oitem.data)
    // }
    return item
  }

  initStructure (structure) {

  }
}
export default InstrcutionData
