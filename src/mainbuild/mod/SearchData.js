// import Vue from 'vue'
// import _func from '@/maindata/func/index'
import DefaultData from './../data/DefaultData'
import DictionaryList from './DictionaryList'

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

class SearchData extends DefaultData {
  constructor (initdata) {
    super(initdata)
    this.show = false
    this.title = {
      show: false,
      data: ''
    }
    this.menu = []
    this.dictionaryList = new DictionaryList()
    if (initdata) {
      this.initSearchData(initdata)
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
  initData() {
    this.modlist = 
  }
}
export default SearchData
