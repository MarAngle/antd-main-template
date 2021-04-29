import mainfunc from './main'
import rule from './data/rule'
import environment from './data/environment'
import setData from './option/setData'
import notice from './option/noticeData'

mainfunc._initMod(rule, [
  {
    originprop: 'check',
    prop: 'checkRule'
  },
  {
    originprop: 'build',
    prop: 'buildRule'
  }
])
mainfunc._initMod(environment)

mainfunc.install = function(Vue, options = {}) {
  // 设置属性重置为Vue.set
  setData.setVue(Vue)
  this.init(options)
  Vue.prototype._func = this
}

export { rule, environment, notice }

export default mainfunc
