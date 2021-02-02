import _func from '@/maindata/func/index'
import DictionaryData from './DictionaryData'
import OptionData from './OptionData'

class DictionaryList {
  constructor (initdata, payload) {
    this.option = new OptionData({
      isChildren: false,
      build: _func.getLimitData(),
      post: {
        empty: false
      },
      tree: false
    })
    this.propdata = {
      id: {
        prop: 'id',
        data: ''
      },
      parentId: {
        prop: 'parentId',
        data: ''
      },
      children: {
        prop: 'children',
        data: ''
      }
    }
    this.num = 0
    this.data = new Map()
    if (initdata) {
      this.initMain(initdata, payload)
    }
  }
  initMain (initdata, payload = {}) {
    payload.type = payload.type || 'init'
    // initdata = this.analyzeInitData(initdata)
    this._setOption(initdata.option)
    this.initDictionaryData(initdata, payload)
  }
  _setOption (option = {}) {
    if (option.isChildren !== undefined) {
      this.option.setData('isChildren', option.isChildren)
    }
    if (option.build) {
      let buildLimit = _func.getLimitData(option.build, 'allow')
      this.option.setData('build', buildLimit, 'init')
    }
    if (option.post) {
      this.option.setData('post', option.post)
    }
    if (option.tree !== undefined) {
      this.option.setData('tree', option.tree)
    }
  }
  // 获取构建设置项
  getBuildOption () {
    let buildOption = this.option.getData('build')
    return buildOption
  }
  // 加载默认初始值.子类自动按照父类来源设置
  analyzeOptionFromParent (optiondata, parentdata, isChildren) {
    if (isChildren && !optiondata.originfrom && parentdata.originfrom) {
      optiondata.originfrom = parentdata.originfrom
    }
  }
  // 分析传参
  analyzeInitData (initdata) {
    return initdata
  }
  // 生成字典列表
  initDictionaryData (initdata, payload) { // type init push replace
    if (payload.type == 'init') {
      this.data.clear()
    }
    if (initdata) {
      initdata = this.analyzeInitData(initdata)
      let parentdata = payload.parent || {}
      let isChildren = this.option.getData('isChildren')
      for (let n in initdata.list) {
        let originDitem = initdata.list[n]
        // 判断是否为一级，不为一级需要将一级的默认属性添加
        this.analyzeOptionFromParent(originDitem, parentdata, isChildren)
        let ditem = this.getItem(originDitem.prop)
        let act = {
          build: true,
          children: true
        }
        if (ditem) {
          if (payload.type == 'init') {
            // 加载模式下不能出现相同字段=加载模式出发前会先清空
            act.build = false
            act.children = false
            console.error(`${parentdata.name}/${parentdata.prop}-字典列表加载: ${originDitem.prop} 重复`)
          } else if (payload.type == 'push') {
            // 添加模式，不对相同ditem做处理，仅对额外数据做处理
            act.build = false
          } else if (payload.type == 'replace') {
            // 重构模式，相同字段替换
          }
        } else {
          // 无对应值，直接添加
        }
        if (act.build) {
          // 构建字典数据
          ditem = new DictionaryData(originDitem, {
            layout: payload.layout,
            parent: parentdata
          })
          this.data.set(ditem.prop, ditem)
        }
        if (act.children) {
          // 构建子字典列表
          this.buildItemDictionary(ditem, originDitem, payload)
        }
      }
      this.initPropData(initdata)
    }
    this.num++
  }
  initPropData (initdata = {}) {
    let list = ['id', 'parentId', 'children']
    for (let n in list) {
      let prop = list[n]
      let data = initdata[prop]
      if (data) {
        let type = _func.getType(data)
        if (type == 'object') {
          this.propdata[prop] = data
        } else if (type == 'string' || type == 'number') {
          this.propdata[prop].prop = data
        } else {
          console.error(`字典列表propdata:${prop}属性格式未预期:${type}，请检查数据!`)
        }
      }
    }
  }
  analyzeBuildData (ditem, originDitem) {
    let initdata = originDitem.dictionary
    let type = ''
    if (this.option.getData('tree') && (this.getPropData('prop', 'children') == ditem.prop) && initdata === undefined) {
      initdata = 'self'
    }
    if (initdata == 'self') {
      type = 'self'
      if (originDitem.type === undefined) {
        ditem.setInterface('type', 'default', 'array')
      }
    } else if (initdata) {
      type = 'build'
    }
    return type
  }
  // 创建字典的字典列表
  buildItemDictionary (ditem, originDitem, payload, isChildren = true) {
    let type = this.analyzeBuildData(ditem, originDitem)
    if (type == 'build') {
      let initdata = this.analyzeInitData(originDitem.dictionary)
      if (!initdata.option) {
        initdata.option = {}
      }
      if (initdata.option.isChildren === undefined) {
        initdata.option.isChildren = isChildren
      }
      // 默认加载本级的build设置
      if (!initdata.option.build) {
        initdata.option.build = this.getBuildOption()
      }
      ditem.dictionary = new DictionaryList(initdata, {
        layout: payload.layout,
        parent: ditem
      })
    } else if (type == 'self') {
      ditem.dictionary = this
    }
  }
  // 重新创建字典列表
  rebuildData (initdata, payload = {}) {
    payload.type = payload.type || 'replace'
    this.initDictionaryData(initdata, payload)
  }

  setPropData (data, target = 'data', prop = 'id') {
    this.propdata[prop][target] = data
  }
  getPropData (target = 'data', prop = 'id') {
    return this.propdata[prop][target]
  }

  // 设置唯一值
  setIdData (data) {
    this.setPropData(data)
  }
  // 获取唯一值
  getIdData () {
    return this.getPropData()
  }
  // 获取唯一值
  getIdProp () {
    return this.getPropData('prop')
  }

  // 获取列表MAP
  getList () {
    return this.data
  }

  // 获取字典
  getItem (data, act = 'prop') {
    if (act == 'prop') {
      return this.data.get(data)
    } else if (act == 'id') {
      for (let ditem of this.data.values()) {
        if (ditem[this.getIdProp()] == data) {
          return ditem
        }
      }
    }
  }

  // 并在编辑的时候添加上ID字段
  setPostDataId (postdata, targetitem) {
    let idprop = this.getIdProp()
    let ditem = this.getItem(idprop)
    let originprop = ditem.getOriginProp(idprop, 'change')
    postdata[originprop] = targetitem[idprop]
  }

  // 根据源数据格式化对象
  formatItem (originitem, type = 'list', option, depth) {
    if (!option) {
      option = this.getBuildOption()
    }
    let targetitem = {}
    this.updateItem(targetitem, originitem, type, option, depth)
    return targetitem
  }
  // 根据源数据更新数据
  updateItem (targetitem, originitem, type = 'info', option, depth) {
    if (!option) {
      option = this.getBuildOption()
    }
    this.formatData(targetitem, originitem, type, option, depth)
    return targetitem
  }
  // 格式化列表数据
  formatListData (targetlist, originlist, type = 'list', option = {}, depth) {
    if (option.clearType === undefined || option.clearType) {
      _func.clearArray(targetlist)
    }
    if (!option.build) {
      option.build = this.getBuildOption()
    }
    for (let n in originlist) {
      let item = this.formatItem(originlist[n], type, option.build, depth)
      targetlist.push(item)
    }
  }
  // 格式化列表数据
  formatTreeData (targetlist, originlist, type = 'list', option = {}) {
    if (option.clearType === undefined || option.clearType) {
      _func.clearArray(targetlist)
    }
    if (!option.build) {
      option.build = this.getBuildOption()
    }
    for (let n in originlist) {
      let item = this.formatItem(originlist[n], type, option.build)
      targetlist.push(item)
    }
  }

  // 根据字典格式化数据
  formatData (targetitem, originitem = {}, type, option, depth) {
    for (let ditem of this.data.values()) {
      this.formatDataNext(ditem, targetitem, originitem, type, option, depth)
    }
    return targetitem
  }
  /**
   * 格式化数据
   * @param {*} ditem 字典
   * @param {*} originitem 原数据
   * @param {*} targetitem 格式化对象
   * @param {*} type mod
   * @param {*} option 设置
   * @param {*} depth 深度
   */
  formatDataNext (ditem, targetitem, originitem, type, option, depth = 0) {
    let build = false
    let isOther = false
    if (!option) {
      option = this.getBuildOption()
    }
    if (!option.getLimit) {
      option = _func.getLimitData(option)
    }
    if (ditem.isOrigin(type)) {
      build = true
    } else if (option.getLimit(type)) {
      // 存在允许值则说明需要额外构建，理论上此处不需要
      // 暂时不需要此操作，暂存，等待后期考虑
      build = false
      isOther = false
    }
    if (build) {
      let targettype = ditem.getInterface('type', type)
      if (!isOther) {
        let originprop = ditem.getInterface('originprop', type)
        let origindata = _func.getPropByStr(originitem, originprop)
        let targetdata
        if (ditem.dictionary) {
          depth++
          if (targettype == 'array') {
            if (origindata && origindata.length > 0) {
              targetdata = []
              this.formatListData(targetdata, origindata, type, { build: option }, depth)
              origindata = targetdata
            } else {
              origindata = []
            }
          } else {
            origindata = ditem.dictionary.formatData({}, origindata, type, option, depth)
          }
        }
        targetdata = ditem.formatOrigin(origindata, {
          targetitem: targetitem,
          originitem: originitem,
          depth: depth,
          type: type
        })
        _func.setStrPropByType(targetitem, ditem.prop, targetdata, ditem.getInterface('type', type), true)
      } else {
        if (targetitem[ditem.prop] === undefined) {
          let targetdata
          if (ditem.dictionary) {
            depth++
            if (targettype == 'array') {
              targetdata = []
            } else {
              targetdata = ditem.dictionary.formatData({}, {}, type, option, depth)
            }
          } else {
            if (targettype == 'object') {
              targetdata = {}
            } else if (targettype == 'array') {
              targetdata = []
            }
          }
          targetitem[ditem.prop] = targetdata
        }
      }
    }
  }
  // 获取符合模块要求的字典列表
  getModList (mod) {
    let modList = []
    this.getModListNext(modList, this.data, mod, '')
    return modList
  }
  // next
  getModListNext (modList, dataMap, mod, parentProp) {
    for (let ditem of dataMap.values()) {
      let fg = ditem.isMod(mod)
      if (fg) {
        modList.push(ditem)
      }
    }
    return modList
  }
  // 将模块列表转换为页面需要数据的列表
  getPageList (mod, modlist, payload = {}) {
    let pagelist = []
    for (let n in modlist) {
      let ditem = modlist[n]
      let pitem = ditem.getModData(mod, payload)
      pagelist.push(pitem)
    }
    return pagelist
  }
  // 根据本地数据格式以及mod列表格式化为后端需要的数据格式
  getPostData (tempdata, modlist, type) {
    let postdata = {}
    for (let n in modlist) {
      let ditem = modlist[n]
      let add = true
      if (!ditem.mod[type].required) {
        add = false
        let emptyPost = this.option.getData('post.empty')
        /*
          存在check则进行check判断
          此时赋值存在2种情况
          1.不存在check 返回data ,data为真则赋值
          2.存在check,返回check函数返回值，为真则赋值
        */
        let checkfg = ditem.triggerFunc('check', tempdata[ditem.prop], {
          targetitem: postdata,
          originitem: tempdata,
          type: type
        })
        // empty状态下传递数据 或者 checkfg为真时传递数据 也就是非post状态的非真数据不传递
        if (emptyPost || checkfg) {
          add = true
        }
      }
      if (add) {
        let targetdata = tempdata[ditem.prop]
        if (ditem.mod[type].trim) {
          targetdata = _func.trimData(targetdata)
        }
        targetdata = ditem.triggerFunc('unedit', targetdata, {
          targetitem: postdata,
          originitem: tempdata,
          type: type
        })
        let originprop = ditem.getInterface('originprop', type)
        _func.setStrPropByType(postdata, originprop, targetdata, ditem.type)
      }
    }
    return postdata
  }
}
export default DictionaryList
