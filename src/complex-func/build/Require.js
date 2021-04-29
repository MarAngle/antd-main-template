import axios from 'axios'
import RequireRule from './RequireRule'
import utils from './../data/utils'
import noticeData from './../option/noticeData'

/*
option:
headers
responseType
timeout
*/

class Require {
  constructor ({ api, option, rule, status }) {
    this.api = {
      baseURL: ''
    }
    this.rule = {}
    this.status = {
      403: '拒绝访问!',
      404: '很抱歉，资源未找到!',
      504: '网络超时!'
    }
    this.list = []
    this._initApi(api)
    this._initService(option)
    this._initRule(rule)
    this._initStatus(status)
  }
  _initApi (api) {
    if (api.baseURL) {
      this.api.baseURL = api.baseURL
    }
  }
  buildOption (option = {}) {
    if (!option.headers) {
      option.headers = {}
    }
    if (!option.headers['Content-Type']) {
      option.headers['Content-Type'] = 'text/plain;charset=UTF-8'
    }
    return option
  }
  _initService (option) {
    this.service = axios.create(this.buildOption(option))
  }
  _initRule (rule) {
    let firstProp
    for (let n in rule) {
      let ruleOption = rule[n]
      this.rule[ruleOption.prop] = new RequireRule(ruleOption)
      firstProp = ruleOption.prop
    }
    if (!this.rule.default) {
      this.rule.default = this.rule[firstProp]
    }
    console.log(`默认的请求规则处理程序为[${this.rule.default.prop}:${this.rule.default.name}]`)
  }
  _initStatus (status = {}) {
    for (let n in status) {
      this.status[n] = status[n]
    }
  }
  checkRule (url) {
    for (let n in this.rule) {
      let fg = this.rule[n].checkUrl(url)
      if (fg) {
        return this.rule[n]
      }
    }
    return this.rule.default
  }
  _formatUrl (url) {
    if (this.formatUrl) {
      return this.formatUrl(url, this.api.baseURL)
    } else {
      if (this.api.baseURL && url.indexOf('https://') != 0 && url.indexOf('http://') != 0) {
        // 当前URL不以http/https开始，则认为此URL需要添加默认前缀
        url = this.api.baseURL + url
      }
      return url
    }
  }
  ajax (optionData = {}) {
    return new Promise((resolve, reject) => {
      this.service(optionData).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // url,
  // data = {},
  // params = {},
  // headers = {},
  // token,
  // requestDataType = 'json',
  // requestCurrentDataType = 'json'
  // responseFormat = true
  // responseType = 'json'

  check (optionData) {
    let check = {
      next: true,
      code: '',
      msg: ''
    }
    // 检查参数
    if (!optionData) {
      check.next = false
      check.code = 'undefined optionData'
      check.msg = '未定义请求数据'
    }
    // 检查URL
    if (check.next) {
      optionData.url = this._formatUrl(optionData.url)
      if (!optionData.url) {
        check.next = false
        check.code = 'undefined URL'
        check.msg = '未定义请求地址'
      }
    }
    // 检查RULE
    let ruleItem
    if (check.next) {
      ruleItem = this.checkRule(optionData.url)
      if (!ruleItem) {
        check.next = false
        check.code = 'undefined rule'
        check.msg = '未检索到对应规则'
      }
    }
    // 添加默认值
    if (!optionData.data) {
      optionData.data = {}
    }
    if (!optionData.params) {
      optionData.params = {}
    }
    if (!optionData.headers) {
      optionData.headers = {}
    }
    if (!optionData.requestDataType) {
      optionData.requestDataType = 'json'
    }
    if (!optionData.requestCurrentDataType) {
      optionData.requestCurrentDataType = 'json'
    }
    if (!optionData.responseType) {
      optionData.responseType = 'json'
    }
    if (optionData.responseFormat === undefined) {
      optionData.responseFormat = true
    }
    // RULE NEXT
    if (check.next) {
      let ruleCheck = ruleItem.format(optionData)
      if (ruleCheck && !ruleCheck.next) {
        check.next = false
        check.code = ruleCheck.code
        check.msg = ruleCheck.msg
        ruleItem.tokenFail(ruleCheck.prop)
      } else {
        check.ruleItem = ruleItem
      }
    }
    return check
  }

  require (optionData) {
    return new Promise((resolve, reject) => {
      let check = this.check(optionData)
      if (check.next) {
        if (optionData.requestDataType == 'formdata') {
          optionData.headers['Content-Type'] = 'multipart/form-data'
          if (optionData.requestCurrentDataType == 'json') {
            optionData.data = utils.jsonToForm(optionData.data)
          }
        } else if (optionData.requestDataType == 'json') {
          optionData.data = JSON.stringify(optionData.data)
        }
        this.requireNext(optionData, check).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else {
        this.showFailMsg(optionData.failMsg, check.msg, 'error')
        reject({ status: 'fail', ...check })
      }
    })
  }
  requireNext (optionData, check) {
    return new Promise((resolve, reject) => {
      this.ajax(optionData).then(response => {
        if (optionData.responseFormat && optionData.responseType == 'json') {
          let nextdata = check.ruleItem.check(response, optionData)
          if (nextdata.status == 'success') {
            resolve(nextdata)
          } else if (nextdata.status == 'login') {
            this.showFailMsg(optionData.failMsg, nextdata.msg, 'error')
            reject(nextdata)
          } else if (nextdata.status == 'fail') {
            this.showFailMsg(optionData.failMsg, nextdata.msg, 'error')
            reject(nextdata)
          }
        } else if (!optionData.responseFormat) {
          resolve({
            status: 'success',
            code: 'unFormat',
            data: response
          })
        } else {
          resolve({
            status: 'success',
            code: 'unJson',
            data: response
          })
        }
      }, error => {
        console.error(error)
        let errRes = this.requireFail(error, optionData, check.ruleItem)
        this.showFailMsg(optionData.failMsg, errRes.msg, 'error', '警告')
        reject(errRes)
      })
    })
  }
  requireFail (error, optionData, ruleItem) {
    let errRes = {
      status: 'fail',
      optionData: optionData,
      error: error
    }
    if (error.response) {
      errRes.code = 'server error'
      let msg = ruleItem.requireFail(errRes)
      if (!msg) {
        msg = this.analyzeStatus(error.response.status)
        if (!msg) {
          msg = '服务器请求失败，请刷新重试或联系管理员！'
        }
      }
      if (errRes.msg === undefined) {
        errRes.msg = msg
      }
    } else {
      errRes.code = 'require error'
      errRes.msg = '服务器请求失败，请刷新重试或联系管理员！'
    }
    return errRes
  }
  analyzeStatus (status) {
    if (status && this.status[status]) {
      return this.status[status]
    } else {
      return ''
    }
  }
  showFailMsg (msgOption, content, type, title) {
    if (msgOption === undefined || msgOption === true) {
      msgOption = {
        show: true,
        content: false,
        type: false,
        title: false
      }
    } else if (!msgOption) {
      msgOption = {
        show: false
      }
    }
    if (msgOption.show) {
      if (msgOption.content) {
        content = msgOption.content
      }
      if (msgOption.type) {
        type = msgOption.type
      }
      if (msgOption.title) {
        title = msgOption.title
      }
      if (content) {
        noticeData.showmsg(content, type, title)
      }
    }
  }
  get (optionData = {}) {
    optionData.method = 'get'
    return this.require(optionData)
  }
  post (optionData = {}) {
    optionData.method = 'post'
    return this.require(optionData)
  }
  postform (optionData = {}) {
    optionData.method = 'post'
    optionData.requestDataType = 'formdata'
    return this.require(optionData)
  }
  postfile (optionData = {}) {
    optionData.method = 'post'
    optionData.requestDataType = 'formdata'
    optionData.requestCurrentDataType = 'formdata'
    return this.require(optionData)
  }

  removeToken (tokenName, prop = 'default') {
    if (this.rule[prop]) {
      return this.rule[prop].removeToken(tokenName)
    } else {
      console.error(`未找到[${tokenName}:${prop}]对应的规则处理程序！`)
      return false
    }
  }
  setToken (tokenName, data, prop = 'default') {
    if (this.rule[prop]) {
      this.rule[prop].setToken(tokenName, data)
    } else {
      console.error(`未找到[${tokenName}:${prop}]对应的规则处理程序！`)
    }
  }
  getToken (tokenName, prop = 'default') {
    if (this.rule[prop]) {
      return this.rule[prop].getToken(tokenName)
    } else {
      console.error(`未找到[${tokenName}:${prop}]对应的规则处理程序！`)
      return false
    }
  }

  toString () {
    return 'Require'
  }
}

export default Require
