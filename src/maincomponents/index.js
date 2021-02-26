import Vue from 'vue'

const _mainviews = require.context('./data', false, /\.vue$/)
const _modviews = require.context('./data', false, /\.vue$/)

function LoadViews (_views, mod = '') {
  let viewlist = _views.keys()
  viewlist.forEach(item => {
    let viewitem = _views(item)
    let viewdata = viewitem.default || viewitem
    Vue.component(`Local${mod}${viewdata.name}`, viewdata)
  })
}

LoadViews(_mainviews)
LoadViews(_modviews, 'Mod')
