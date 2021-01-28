import _utils from './../data/utils'

const defaultOption = {
  location: 'body', // 默认赋值位置
  defaultName: 'default', // 默认操作判断字符串
  empty: false // 值不为真时的上传操作判断值： 真上传空值 否则不上传 require = false 时生效
}

class RequireRule {
  constructor ({
    name,
    prop,
    token,
    methods
  }) {
    this.name = name
    this.prop = prop
    this.token = {
      check: true, // 是否检查token
      fail: false, // token失败回调
      data: {}
    }
    this._initToken(token)
    this._initMethods(methods)
  }

  _initToken (token = {}) {
    this.token.check = token.check === undefined ? true : token.check
    this.token.fail = token.fail || false
    let tokenOption = {}
    if (token.data) {
      for (let n in token.data) {
        let optionItem = this._buildTokenRule(token.data[n])
        tokenOption[n] = optionItem
      }
    }
    this.token.data = tokenOption
  }
  _buildTokenRule (origindata) {
    let targetitem = {}
    let type = _utils.getType(origindata)
    if (type == 'string') {
      origindata = {
        data: origindata
      }
    }
    targetitem.require = origindata.require || false
    targetitem.data = origindata.data || undefined
    targetitem.location = origindata.location || defaultOption.location
    targetitem.empty = origindata.empty === undefined ? defaultOption.empty : origindata.empty
    targetitem.getData = origindata.getData || false
    targetitem.checkData = origindata.checkData || false
    origindata = null
    return targetitem
  }
  _initMethods (methods) {
    for (let n in methods) {
      this[n] = methods[n].bind(this)
    }
    if (!this.formatUrl) {
      this.formatUrl = function (url) {
        return url
      }
    }
  }
  tokenFail (tokenName) {
    if (this.token.fail) {
      this.token.fail(tokenName, this)
    }
  }
  requireFail (errRes) {
    if (this.failMsg) {
      return this.failMsg(errRes)
    } else {
      return ''
    }
  }

  format (optionData) {
    optionData.url = this.formatUrl(optionData.url)
    return this.appendToken(optionData)
  }

  appendToken (optionData) {
    if (this.token.check) {
      if (optionData.token === undefined) {
        optionData.token = defaultOption.defaultName
      }
      let type = _utils.getType(optionData.token)
      if (type == 'string') {
        if (optionData.token == defaultOption.defaultName) {
          for (let n in this.token.data) {
            let check = this.appendTokenNext(optionData, n)
            if (!check.next) {
              return check
            }
          }
        } else {
          let check = this.appendTokenNext(optionData, optionData.token)
          if (!check.next) {
            return check
          }
        }
      } else if (type == 'array') {
        for (let n in optionData.token) {
          let check = this.appendTokenNext(optionData, optionData.token[n])
          if (!check.next) {
            return check
          }
        }
      } else if (type == 'object') {
        for (let n in optionData.token) {
          let check = this.appendTokenNext(optionData, n, optionData.token[n])
          if (!check.next) {
            return check
          }
        }
      }
    }
  }

  appendTokenNext (optionData, prop, tokenRuleOption) {
    let check = {
      prop: prop,
      next: true,
      code: '',
      msg: ''
    }
    let append = true
    let tokenRule = this.getTokenRule(prop, tokenRuleOption)
    let tokenRuleData
    if (tokenRule) {
      tokenRuleData = this.getTokenDataByRule(prop, tokenRule)
      if (!tokenRuleData) {
        if (tokenRule.checkData && tokenRule.checkData(tokenRuleData)) {
          //
        } else { // 不存在检查函数或者检查函数返回否
          if (tokenRule.require) {
            check.next = false
            check.code = 'undefined token'
            check.msg = `TOKEN:${prop}的值不存在`
          } else {
            if (!tokenRule.empty) {
              append = false
            }
          }
        }
      }
    } else {
      check.next = false
      check.code = 'undefined rule prop'
      check.msg = `未找到${prop}对应的token规则`
    }
    if (check.next && append) {
      if (tokenRule.location == 'body') {
        _utils.appendProp(optionData.data, prop, tokenRuleData, optionData.localType)
      } else if (tokenRule.location == 'header') {
        optionData.headers[prop] = tokenRuleData
      } else if (tokenRule.location == 'params') {
        optionData.params[prop] = tokenRuleData
      }
    }
    return check
  }
  getTokenRule (prop, tokenRuleOption) {
    if (!tokenRuleOption) {
      if (this.token.data[prop]) {
        return this.token.data[prop]
      } else {
        return false
      }
    } else {
      return this._buildTokenRule(this.tokenRuleOption)
    }
  }
  getTokenDataByRule (prop, tokenRule) {
    let data
    if (tokenRule.getData) {
      data = tokenRule.getData()
    } else {
      data = tokenRule.data
    }
    if (!data) {
      data = _utils.getLocalTemp(this._buildTokenName(prop))
      if (data) {
        this.setToken(prop, data, true)
      }
    }
    return data
  }
  removeToken (tokenName) {
    if (tokenName) {
      if (tokenName === true) {
        for (let n in this.token.data) {
          this.setToken(n, '')
        }
      } else {
        this.setToken(tokenName, '')
      }
      return true
    } else {
      console.error(`未指定需要删除的token`)
      return false
    }
  }
  getToken (tokenName) {
    if (this.token.data[tokenName]) {
      return this.getTokenDataByRule(tokenName, this.token.data[tokenName])
    } else {
      return false
    }
  }
  setToken (tokenName, data, noSave) {
    if (!this.token.data[tokenName]) {
      this.token.data[tokenName] = this._buildTokenRule(data)
    } else {
      this.token.data[tokenName].data = data
    }
    if (!noSave) {
      _utils.setLocalTemp(this._buildTokenName(tokenName), data)
    }
  }
  _buildTokenName (prop) {
    return `${this.prop}-${prop}`
  }
  toString () {
    return 'RequireRule'
  }
}

export default RequireRule
