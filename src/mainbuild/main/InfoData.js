import _func from '@/maindata/func/index'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'

class InfoData extends ComplexDataWithSearch {
  constructor (initdata = {}) {
    super(initdata)
    this._initInfoData(initdata)
    this.triggerCreateLife('InfoData')
  }
  _initInfoData ({ option }) {
    this._initInfoDataOption(option)
  }
  // 加载设置项
  _initInfoDataOption (option) {
    if (option) {}
  }
  // 格式化信息数据
  formatData (origindata = {}, type = 'list', option = {}) {
    if (!option.type) {
      option.type = 'add'
    }
    this.updateItem(this.data.current, origindata, type, option)
  }
  // 数据重新拉取
  reloadData (force, ...args) {
    return new Promise((resolve, reject) => {
      this.loadData(force, ...args).then(res => {
        resolve(res)
      }, err => {
        console.error(err)
        reject(err)
      })
    })
  }
  // --数据相关--*/
  // 获取对象
  getItem(prop) {
    if (prop) {
      return this.data.current[prop]
    } else {
      return this.data.current
    }
  }
}

export default InfoData
