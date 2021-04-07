import _func from '@/maindata/func/index'
import InterfaceData from './InterfaceData'
import SimpleData from './../data/SimpleData'

class LayoutData extends SimpleData {
  constructor (maindata) {
    super()
    this.initData(maindata)
  }
  initData (maindata) {
    if (!maindata) {
      maindata = {
        default: undefined
      }
    }
    for (let n in maindata) {
      maindata[n] = this.formatLayout(maindata[n])
    }
    this.data = new InterfaceData(maindata)
  }
  formatLayout(data) {
    if (!data) {
      data = {}
    }
    if (!data.type) {
      data.type = 'grid'
    }
    if (!data.data) {
      data.data = {
        label: 8,
        content: 16
      }
    }
    return data
  }
  setData (prop, data) {
    this.data.setData(prop, data)
  }
  getData (prop) {
    return this.data.getData(prop)
  }
  getMain () {
    return this.data.getMain()
  }
}
export default LayoutData
