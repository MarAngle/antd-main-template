// 限制数据格式
// 需要保证次数据对象传递到initdata中依然能生成一个limitdatad对象，保证数据的一致性
class LimitData {
  constructor (initdata = {}, autoType) {
    this.type = 'forbid'
    this.list = []
    this._initMain(initdata, autoType)
  }
  _initMain (initdata = {}, autoType) {
    this.setType(initdata.type, autoType)
    this.setList(initdata.list)
  }
  // 设置类型
  setType (type, autoType = 'forbid') {
    this.type = type || autoType
  }
  // 设置限制列表
  setList (list = []) {
    this.list = list
  }
  // 获取限制false不限制
  getLimit (data) {
    if (this.type == 'forbid') {
      // 存在则为限制
      return this.list.indexOf(data) > -1
    } else if (this.type == 'allow') {
      // 存在则为允许
      return this.list.indexOf(data) < 0
    }
  }
  selfName () {
    return `[${this.constructor.name}]`
  }
}
export default LimitData
