import mainfunc from './main'
import setData from './option/setData'

mainfunc.install = function(Vue, options = {}) {
  // 设置属性重置为Vue.set
  setData.setVue(Vue)
  // module属性，挂载到根节点上
  if (options.module) {
    for (let n in options.module) {
      mainfunc[n] = options.module[n]
    }
  }
  if (options.methods) {
    for (let n in options.methods) {
      mainfunc[n] = options.methods[n]
    }
  }
  if (options.require) {
    mainfunc.initRequire(options.require)
  }
}

export default mainfunc
