import _func from '@/maindata/func/index'
import InterfaceData from './InterfaceData'
import SimpleData from './../data/SimpleData'

class LayoutData extends SimpleData {
  constructor (initdata) {
    super()
    this.initData(initdata)
  }
  initData (initdata) {
    if (!initdata) {
      initdata = {
        default: undefined
      }
    }
    for (let n in initdata) {
      initdata[n] = this.formatLayout(initdata[n])
    }
    this.data = new InterfaceData(initdata)
  }
  formatLayout(data) {
    if (!data) {
      data = {}
    }
    if (!data.type) {
      data.type = 'grid'
    }
    if (!data.data) {
      if (data.type == 'grid') {
        data.data = {
          label: 8,
          content: 16
        }
      } else if (data.type == 'width') {
        data.data = {
          width: undefined
        }
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
