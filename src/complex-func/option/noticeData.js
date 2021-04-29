let noticeData = {}

noticeData.showmsg = function(...args) {
  console.error('notice对应方法未定义')
}
noticeData.alert = function(...args) {
  console.error('notice对应方法未定义')
}
noticeData.confirm = function(...args) {
  console.error('notice对应方法未定义')
}

noticeData.init = function({
  data = {},
  methods
}) {
  this.data = data
  for (let n in methods) {
    this[n] = methods[n]
  }
}

export default noticeData
