import { option } from 'complex-data'
import EditData from './data/EditData'
import _func from '@/maindata/func/index'

option.setData({
  list: {
    format: function (ditem, mod, data) {
      if (data) {
        if (!data.dataIndex) {
          data.dataIndex = ditem.prop
        }
        if (!data.align) {
          data.align = 'center'
        }
        if (!data.width) {
          data.width = 100
        }
        if (data.ellipsis === undefined) {
          data.ellipsis = true
        }
        if (data.autoText === undefined) {
          data.autoText = true
        }
        if (data.customCell) {
          let type = _func.getType(data.customCell)
          if (type == 'object') {
            let customCellOption = data.customCell
            data.customCell = () => {
              return customCellOption
            }
          }
        }
        if (data.customHeaderCell) {
          let type = _func.getType(data.customHeaderCell)
          if (type == 'object') {
            let customHeaderCellOption = data.customHeaderCell
            data.customHeaderCell = () => {
              return customHeaderCellOption
            }
          }
        }
        ditem.mod[mod] = data
      }
    },
    unformat: function (ditem, mod) {
      let pitem = {
        ...ditem.mod[mod],
        func: ditem.func
      }
      if (!pitem.title) {
        pitem.title = ditem.getInterface('label', mod)
      }
      return pitem
    }
  },
  info: {
    unformat: function (ditem, mod, { targetitem }) {
      let pitem = {
        prop: ditem.prop,
        label: ditem.getInterface('label', mod),
        showtype: ditem.getInterface('showtype', mod),
        layout: ditem.getLayout(mod)
      }
      let target = ditem.triggerFunc('show', targetitem[ditem.prop], {
        targetitem: targetitem,
        type: mod
      })
      pitem.data = target
      return pitem
    }
  },
  edit: {
    format: function (ditem, mod, data) {
      if (data.type == 'edit') {
        ditem.mod[mod] = ditem.mod.edit
      } else {
        // data.prop = ditem.prop
        data.parent = ditem
        ditem.mod[mod] = new EditData(data, {
          // type: ditem.getInterface('type', prop),
        })
      }
    },
    unformat: function (ditem, mod) {
      let pitem = {
        prop: ditem.prop,
        label: ditem.getInterface('label', mod),
        originprop: ditem.getInterface('originprop', mod),
        type: ditem.getInterface('type', mod),
        func: ditem.func,
        layout: ditem.getLayout(mod),
        edit: ditem.mod[mod]
      }
      // pitem.edit.readyData()
      return pitem
    },
    build: function (data, mod, payload) {
      data.form = {
        num: 0,
        dom: null,
        data: {}
      }
    }
  },
  build: {
    type: 'edit'
  },
  change: {
    type: 'edit'
  }
})
