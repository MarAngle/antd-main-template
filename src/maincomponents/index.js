import Vue from 'vue'
import './mod/index'

const _mainviews = require.context('./data', false, /\.vue$/)

function LoadViews (_views) {
  let viewlist = _views.keys()
  viewlist.forEach(item => {
    let viewitem = _views(item)
    let viewdata = viewitem.default || viewitem
    Vue.component(`Local${viewdata.name}`, viewdata)
  })
}

LoadViews(_mainviews)
