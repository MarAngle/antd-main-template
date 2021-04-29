import mainfunc from './main'
import setData from './option/setData'

mainfunc.install = function(Vue, options = {}) {
  // 设置属性重置为Vue.set
  setData.setVue(Vue)
  this.init(options)
  Vue.prototype._func = this
}

export default mainfunc
