// 限制数据格式
// 需要保证次数据对象传递到initdata中依然能生成一个Timedatad对象，保证数据的一致性
class TimeData {
  constructor (initdata = {}, autoType) {
    this.type = 'forbid'
    this.list = []
    this._initMain(initdata, autoType)
  }
  _selfName () {
    return `[${this.constructor.name}]`
  }
}
export default TimeData
