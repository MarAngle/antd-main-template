import Vue from 'vue'
import _func from '@/maindata/func/index'
import ComplexData from './ComplexData'

class SearchData extends ComplexData {
  constructor (initdata) {
    super(initdata)
    this.show = false
    this.title = {
      show: false,
      data: ''
    }
    this.post = {}
    this.modlist = []
    this.mainlist = []
    if (initdata) {
      this._initSearchData(initdata)
    }
  }
  _initSearchData ({
    title,
    menu
  }) {
    this.show = true
    this._initTitle(title)
    this._initMenu(menu)
    this.formatList()
  }
  // 加载标题
  _initTitle (title) {
    if (title) {
      this.title.data = title
      this.title.show = true
    }
  }
  // menu 列表 type 类型/add/replace
  _initMenu (menu = {}) {
    let defaultMenu = [
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
    if (!menu.list) {
      menu.list = []
    }
    if (!menu.type) {
      menu.type = 'add'
    }
    if (menu.type == 'add') {
      menu.list = defaultMenu.concat(menu.list)
    }
    this.menu = menu.list
  }
  // 生成编辑数据并将modlist mainlist提到根节点
  formatList () {
    this.buildModData('build')
    this.modlist = this.mod.build.modlist
    this.mainlist = this.mod.build.mainlist
    this.resetData('init')
  }
  // 保存当前检索值
  setData (prop = 'edit', type = 'build') {
    let postdata = this.getPostData(this.mod[prop].form.data, this.modlist, type)
    this.post[prop] = postdata
  }
  // 获取检索值
  getData (prop = 'edit') {
    return _func.deepClone(this.post[prop], true)
  }
  // 重置检索值
  resetData (from = 'init', option = {}, prop = 'edit', type = 'build') {
    let limit = _func.getLimitData(option.limit)
    for (let n in this.mainlist) {
      let pitem = this.mainlist[n]
      if (!limit.getLimit(pitem.prop)) {
        let targetdata = from == 'init' ? pitem.edit.getValueData('initdata') : pitem.edit.getValueData('resetdata')
        Vue.set(this.mod[prop].form.data, pitem.prop, targetdata)
      }
    }
    let postdata = this.getPostData(this.mod[prop].form.data, this.modlist, type)
    this.post[prop] = postdata
  }
}
export default SearchData
