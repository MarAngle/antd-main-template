import moment from 'moment'

let currentDate = {
  data: null,
  timer: undefined,
  offset: 1000 * 60 // 1分钟
}
currentDate.init = function() {
  currentDate.update()
}
currentDate.update = function() {
  this.data = moment()
  this.timer = setTimeout(() => {
    this.update()
  }, this.offset)
}
currentDate.clear = function() {
  if (this.timer) {
    clearTimeout(this.timer)
    this.timer = undefined
  }
}

currentDate.getCurrent = function() {
  return this.data
}

currentDate.init()

export default currentDate
