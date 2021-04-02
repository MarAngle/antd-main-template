import Vue from 'vue'
import _func from '@/maindata/func/index'
import ComplexData from './../data/ComplexData'

const defaultMenu = [
  {
    type: 'primary',
    icon: 'search',
    name: '查询',
    act: 'search'
  },
  {
    type: 'default',
    icon: 'reload',
    name: '重置',
    act: 'reset'
  }
]

class SearchData extends ComplexData {
  constructor (initdata) {
    super(initdata)
    this.show = false
    this.title = {
      show: false,
      data: ''
    }
    this.menu = []
    this.form = {}
    this.post = {}
    if (initdata) {
      this.initSearchData(initdata)
      this.initFormData()
    }
  }

  initSearchData({
    title,
    menu
  }) {
    this.show = true
    this.initTitle(title)
    this.initMenu(menu)
  }
  initTitle(title) {
    if (title) {
      this.title.data = title
      this.title.show = true
    }
  }
  initMenu(menu = {}) {
    if (!menu.list) {
      menu.list = []
    }
    if (!menu.type) {
      menu.type = 'default'
    }
    if (menu.type == 'default') {
      menu.list = defaultMenu.concat(menu.list)
    }
    this.menu = menu.list
  }
  initFormData(type = 'build') {
    this.form[type] = {
      modlist: [],
      mainlist: [],
      form: {
        data: {}
      }
    }
    this.form[type].modlist = this.getDictionaryModList('build')
    this.form[type].mainlist = this.getDictionaryPageListByModList('build', this.form[type].modlist)
    this.resetFormData('init')
  }
  // 重置检索值
  resetFormData(from = 'init', option = {}, syncPost = true, type = 'build') {
    let limit = _func.getLimitData(option.limit)
    for (let n in this.form[type].mainlist) {
      let pitem = this.form[type].mainlist[n]
      if (!limit.getLimit(pitem.prop)) {
        let targetdata = from == 'init' ? pitem.edit.getValueData('initdata') : pitem.edit.getValueData('resetdata')
        Vue.set(this.form[type].form.data, pitem.prop, targetdata)
      }
    }
    if (syncPost) {
      this.setData(type)
    }
  }
  setData(type = 'build') {
    this.post[type] = this.getEditData(this.form[type].form.data, this.form[type].modlist, 'build')
  }
  getData(type = 'build', deep = true) {
    if (deep) {
      return _func.deepClone(this.post[type], deep)
    } else {
      return this.post[type]
    }
  }
  reset() {
    this.resetFormData('reset')
  }
  install (target) {
    target.onLife('reseted', {
      name: 'AutoModuleSearchDataReseted',
      func: () => {
        this.reset()
      }
    })
  }
  uninstall(target) {
    target.offLife('reseted', 'AutoModuleSearchDataReseted')
  }
  // install(target) {
  //   let dict = [
  //     {
  //       prop: 'setSearch',
  //       originProp: 'setData'
  //     },
  //     {
  //       prop: 'getSearch',
  //       originProp: 'getData'
  //     },
  //     {
  //       prop: 'resetSearch',
  //       func: (...args) => {
  //         this.resetFormData('reset', ...args)
  //       }
  //     }
  //   ]
  //   for (let n = 0; n < dict.length; n++) {
  //     let dictData = dict[n]
  //     if (!target[dictData.prop]) {
  //       if (dictData.func) {
  //         target[dictData.prop] = (...args) => {
  //           return dictData.func(...args)
  //         }
  //       } else {
  //         target[dictData.prop] = (...args) => {
  //           return this[dictData.originProp](...args)
  //         }
  //       }
  //     } else {
  //       target._printInfo(`存在${dictData.prop}方法,${this._selfName()}install=>${dictData.originProp}失败`)
  //     }
  //   }
  //   target.setLifeData({
  //     type: 'reseted',
  //     func: () => {
  //       this.reset()
  //     }
  //   })
  // }
}
export default SearchData
