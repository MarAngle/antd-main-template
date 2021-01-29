import _func from '@/maindata/func/index'
import { BaseData, ParentData, PaginationData } from '@/mainbuild/index'

/*
EDIT在select生成检索值逻辑等待重置
此处生成select需要加载listdata,而listdata的生成需要先生成editdata，互为依赖加载失败
*/

function emptyFunc () { }

function eventFunc (event) {
  if (this.func[event]) {
    return this.func[event]
  } else {
    return emptyFunc
  }
}

function dateUnEdit (value) {
  return value.format(this.option.formatedit)
}

function dateRangeUnEdit (value) {
  let res = []
  if (value && value.length == 2) {
    res.push(value[0].format(this.option.formatedit))
    res.push(value[1].format(this.option.formatedit))
  }
  return res
}

function formatDateTimeOption (option, range) {
  const defaultValueData = '00:00:00'
  if (option) {
    if (option === true) {
      option = {}
    }
    if (!option.format) {
      option.format = 'HH:mm:ss'
    }
    if (range == 'range') {
      let defaultValue = option.defaultValue || []
      option.defaultValue = [_func.moment(defaultValue[0] || defaultValueData, option.format), _func.moment(defaultValue[1] || defaultValueData, option.format)]
    } else {
      let defaultValue = option.defaultValue || defaultValueData
      option.defaultValue = _func.moment(defaultValue, option.format)
    }
  } else {
    option = false
  }
  return option
}

const canlist = {
  data: {
    ainput: {
      defaultdata: '',
      trim: true,
      placeholder: {
        front: '请输入',
        end: ''
      },
      rules: {
        msg: {
          front: '请输入',
          end: ''
        },
        trigger: 'change'
      }
    },
    ainputNumber: {
      defaultdata: '',
      trim: false,
      placeholder: {
        front: '请输入',
        end: ''
      },
      rules: {
        msg: {
          front: '请输入',
          end: ''
        },
        trigger: 'change'
      }
    },
    aswitch: {
      defaultdata: false,
      trim: false,
      placeholder: false
    },
    aselect: {
      defaultdata: undefined,
      trim: false,
      placeholder: {
        front: '请选择',
        end: ''
      },
      rules: {
        msg: {
          front: '请输入',
          end: ''
        },
        trigger: 'change'
      },
      func: [
        {
          name: 'onOpenEvent',
          data: function (value) {
            if (this.func.onOpenBegin) {
              this.func.onOpenBegin(value)
            }
            if (this.func.onOpen) {
              this.func.onOpen(value)
            }
            if (this.func.onOpenEnd) {
              this.func.onOpenEnd(value)
            }
          }
        },
        {
          name: 'onSearchEvent',
          data: function (value) {
            if (this.func.onSearchBegin) {
              this.func.onSearchBegin(value)
            }
            if (this.func.onSearch) {
              this.func.onSearch(value)
            }
            if (this.func.onSearchEnd) {
              this.func.onSearchEnd(value)
            }
          }
        },
        {
          act: 'get',
          name: 'onSelectEvent',
          data: eventFunc,
          payload: 'onSelect'
        },
        {
          name: 'clearList',
          data: function () {
            this.option.list = []
            if (this.option.pagination) {
              this.option.pagination.setTotal(0)
            }
          }
        }
      ]
    },
    adatePicker: {
      defaultdata: null,
      trim: false,
      placeholder: {
        front: '请选择',
        end: ''
      },
      rules: {
        msg: {
          front: '请选择',
          end: ''
        },
        trigger: 'change'
      },
      func: [
        {
          name: 'unedit',
          data: dateUnEdit
        },
        {
          act: 'get',
          name: 'onOkEvent',
          data: eventFunc,
          payload: 'onOk'
        },
        {
          act: 'get',
          name: 'onOkEvent',
          data: eventFunc,
          payload: 'onOk'
        },
        {
          act: 'get',
          name: 'onCheckDateEvent',
          data: eventFunc,
          payload: 'onCheckDate'
        },
        {
          act: 'get',
          name: 'onCheckTimeEvent',
          data: eventFunc,
          payload: 'onCheckTime'
        }
      ]
    },
    adateRangePicker: {
      defaultdata: [],
      trim: false,
      placeholder: {
        front: '请选择',
        end: ''
      },
      rules: {
        msg: {
          front: '请选择',
          end: ''
        },
        trigger: 'change'
      },
      func: [
        {
          name: 'unedit',
          data: dateRangeUnEdit
        },
        {
          act: 'get',
          name: 'onOkEvent',
          data: eventFunc,
          payload: 'onOk'
        },
        {
          act: 'get',
          name: 'onCheckDateEvent',
          data: eventFunc,
          payload: 'onCheckDate'
        },
        {
          act: 'get',
          name: 'onCheckTimeEvent',
          data: eventFunc,
          payload: 'onCheckTime'
        }
      ]
    },
    afile: {
      defaultdata: undefined,
      trim: false,
      placeholder: {
        front: '上传',
        end: ''
      },
      rules: {
        msg: {
          front: '请上传',
          end: ''
        },
        trigger: 'change'
      }
    },
    abutton: {
      defaultdata: undefined,
      trim: false,
      placeholder: {
        front: '',
        end: ''
      },
      rules: {
        msg: {
          front: '',
          end: ''
        }
      }
    }
  }
}

/*
datePicker
事件说明
change事件 不存在时可以以此为参考
ok事件 => 存在确认时理论上应该以ok作为事件
onCheckDate日期检查true不可用
onCheckTime时间检查
*/
function getOpt (type) {
  type = 'a' + type
  return canlist.data[type]
}

class EditData extends BaseData {
  constructor (editdata, payload) {
    super(editdata)
    this._initMainByEditData(editdata, payload)
  }
  _initMainByEditData (editdata, payload = {}) {
    this._initParent(payload)
    this.initMain(editdata)
    this.initSlot(editdata, payload)
    this.initTips(editdata)
    this.initType(editdata, payload)
  }
  _initParent ({ parent }) {
    this.parentdata = new ParentData(parent)
  }
  setParent (data) {
    this.parentdata.setData(data)
  }
  getParent (n) {
    return this.parentdata.getData(n)
  }
  initMain (editdata) {
    // this.formatType = editdata.formatType // 格式化的判断值，因为edit存在的原因暂时不从此处取值
    this.reload = editdata.reload || false
    this.label = editdata.label
    if (editdata.hideLabel === undefined) {
      this.hideLabel = !this.label
    } else {
      this.hideLabel = editdata.hideLabel
    }
    if (editdata.mainwidth) {
      let type = _func.getType(editdata.mainwidth)
      if (type == 'number') {
        this.mainwidth = editdata.mainwidth + 'px'
      } else {
        this.mainwidth = editdata.mainwidth
      }
    } else {
      this.mainwidth = 'auto'
    }
    if (editdata.width) {
      let type = _func.getType(editdata.width)
      if (type == 'number') {
        this.width = editdata.width + 'px'
      } else {
        this.width = editdata.width
      }
    } else {
      this.width = '100px'
    }
    this.colon = editdata.colon === undefined ? true : editdata.colon // label属性：显示判断值
    this.disabled = editdata.disabled || false
    this.option = {}
    this.value = {}
  }
  // slot格式化编辑数据
  initSlot (editdata, payload) {
    if (editdata.slot) { // label main inside front end
      let slotType = _func.getType(editdata.slot)
      if (slotType == 'boolean') {
        // 布尔值为真
        this.slot = {
        }
      } else if (slotType == 'string') {
        // 字符串默认为main格式的slot名称
        this.slot = {
          name: editdata.slot
        }
      } else {
        this.slot = editdata.slot
      }
      if (!this.slot.name) {
        this.slot.name = this.prop
      }
    } else {
      this.slot = {
        name: this.prop
      }
    }
    if (!this.slot.label) {
      this.slot.label = this.prop + '-label'
    }
  }
  // 格式化编辑数据
  initTips (editdata) {
    // tips提示
    if (!editdata.tips) {
      this.tips = {
        data: ''
      }
    } else {
      let tipsType = _func.getType(editdata.tips)
      if (tipsType != 'object') {
        this.tips = {
          data: editdata.tips
        }
      } else {
        this.tips = editdata.tips
      }
    }
    if (!this.tips.placement) {
      this.tips.placement = 'topLeft'
    }
  }
  initType (editdata, payload) {
    this.type = editdata.type || 'input'
    let opt = getOpt(this.type)
    this.initValue(editdata, opt)
    this.required = editdata.required || false
    this.trim = editdata.trim === undefined ? opt.trim : editdata.trim
    // 格式化占位符和检验规则
    if (opt.placeholder) {
      if (!editdata.placeholder) {
        this.placeholder = `${opt.placeholder.front}${this.name}${opt.placeholder.end}`
      } else {
        this.placeholder = editdata.placeholder
      }
    }
    // 输入框单独格式化内容
    if (this.type == 'input') {
      if (!editdata.option) {
        editdata.option = {}
      } else {
        let optionType = _func.getType(editdata.option)
        if (optionType == 'string') {
          editdata.option = {
            type: editdata.option
          }
        }
      }
      this.option.type = editdata.option.type || 'text'
      this.option.maxLength = editdata.option.maxLength || 20
      this.option.hideClear = editdata.option.hideClear || false
      if (!editdata.option.prefix) {
        this.option.prefix = {
          show: false
        }
      } else if (_func.getType(editdata.option.prefix) == 'string') {
        this.option.prefix = {
          show: true,
          icon: editdata.option.prefix
        }
      } else {
        this.option.prefix = editdata.option.prefix
      }
      if (!editdata.option.suffix) {
        this.option.suffix = {
          show: false
        }
      } else if (_func.getType(editdata.option.suffix) == 'string') {
        this.option.suffix = {
          show: true,
          icon: editdata.option.suffix
        }
      } else {
        this.option.suffix = editdata.option.suffix
      }
    } else if (this.type == 'inputNumber') {
      if (!editdata.option) {
        editdata.option = {}
      }
      this.option.max = editdata.option.max === undefined ? Infinity : editdata.option.max
      this.option.min = editdata.option.min === undefined ? -Infinity : editdata.option.min
      this.option.precision = editdata.option.precision === undefined ? 0 : editdata.option.precision // 精确到几位小数，接受非负整数
      // this.option.decimalSeparator = editdata.option.decimalSeparator
      this.option.step = editdata.option.step === undefined ? 1 : editdata.option.step // 点击步进
    } else if (this.type == 'select') {
      if (editdata.option) {
        this.option.list = editdata.option.list || []
        this.option.multiple = editdata.option.multiple || false
        this.option.optionValue = editdata.option.optionValue || 'value'
        this.option.optionLabel = editdata.option.optionLabel || 'label'
        this.option.optionDisabled = editdata.option.optionDisabled || 'disabled'
        this.option.popupLocation = editdata.option.popupLocation || 'form'
        this.option.hideArrow = editdata.option.hideArrow || false
        this.option.hideClear = editdata.option.hideClear || false
        this.option.filterOption = editdata.option.filterOption || false
        this.option.autoWidth = editdata.option.autoWidth || false
        this.option.noDataContent = editdata.option.noDataContent
        if (this.option.multiple) {
          this.setValueToArray()
        }
        if (editdata.option.pagination) {
          let paginationOpt = editdata.option.pagination === true ? {
            size: 7,
            sizehidden: true,
            jumphidden: true,
            total: 'hidden'
          } : editdata.option.pagination
          this.option.pagination = new PaginationData(paginationOpt)
          if (!this.func.onPageEvent) {
            this.func.onPageEvent = (act, data) => {
              this.loadData(true).then(res => { }, err => {
                console.error(err)
              })
            }
          }
        } else {
          this.option.pagination = false
        }
        let searchType = _func.getType(editdata.option.search)
        if (searchType != 'object') {
          editdata.option.search = {
            show: !!editdata.option.search
          }
        }
        editdata.option.search.min = editdata.option.search.min || 0
        editdata.option.search.noDataContent = editdata.option.search.noDataContent || this.option.noDataContent
        editdata.option.search.noSizeContent = editdata.option.search.noSizeContent || `请输入${editdata.option.search.min}位及以上的值检索`
        this.option.search = editdata.option.search
        if (this.option.search.show) {
          this.option.search.value = ''
          if (!this.func.onOpenBegin) {
            this.func.onOpenBegin = (value) => {
              if (value) {
                if (this.getValueData('initdata') === this.getValueData('defaultdata')) {
                  this.func.onSearch('')
                }
              }
            }
          }
          if (!this.func.autoSearchAct) {
            this.func.autoSearchAct = (act) => {
              if (act == 'init') {
                let num = this.option.search.value.length
                if (num < this.option.search.min) {
                  this.option.noDataContent = this.option.search.noSizeContent
                  this.func.clearList()
                  return false
                } else {
                  return true
                }
              } else if (act == 'loading') {
                this.option.noDataContent = '检索中...'
                return true
              } else if (act == 'loaded') {
                if (this.option.list.length <= 0) {
                  this.option.noDataContent = this.option.search.noDataContent
                  return false
                } else {
                  return true
                }
              }
            }
          }
          if (!this.func.onSearch) {
            this.func.onSearch = (value) => {
              this.option.search.value = value || ''
              if (this.func.autoSearchAct('init')) {
                this.func.autoSearchAct('loading')
                this.func.getData(this.option.search.value).then(res => {
                  this.func.autoSearchAct('loaded')
                }, err => {
                  console.error(err)
                  this.func.clearList()
                  this.func.autoSearchAct('loaded')
                })
              }
            }
          }
          if (!this.func.loadData) {
            this.func.loadData = (payload) => {
              return new Promise((resolve, reject) => {
                if (this.func.autoSearchAct('init')) {
                  this.func.autoSearchAct('loading')
                  this.func.getData(payload).then(res => {
                    this.func.autoSearchAct('loaded')
                    resolve(res)
                  }, err => {
                    console.error(err)
                    this.func.autoSearchAct('loaded')
                    reject(err)
                  })
                } else {
                  resolve({ status: 'success', msg: 'needSize' })
                }
              })
            }
          }
        }
      }
    } else if (this.type == 'datePicker') {
      if (!editdata.option) {
        editdata.option = {}
      }
      this.option.format = editdata.option.format || 'YYYY-MM-DD'
      this.option.formatedit = editdata.option.formatedit || this.option.format
      this.option.showTime = formatDateTimeOption(editdata.option.showTime)
    } else if (this.type == 'dateRangePicker') {
      if (!editdata.option) {
        editdata.option = {}
      }
      this.option.format = editdata.option.format || 'YYYY-MM-DD'
      this.option.formatedit = editdata.option.formatedit || this.option.format
      this.option.separator = editdata.option.separator || '-'
      this.option.showTime = formatDateTimeOption(editdata.option.showTime, 'range')
      if (_func.getType(this.placeholder) != 'array') {
        this.placeholder = [this.placeholder, this.placeholder]
      }
    } else if (this.type == 'button') {
      if (!editdata.option) {
        editdata.option = {}
      }
      this.option.layout = editdata.option.layout || 'auto'
      this.option.loading = editdata.option.loading || false
      this.option.type = editdata.option.type || 'default'
      this.option.icon = editdata.option.icon || ''
      this.option.act = editdata.option.act || ''
      this.option.name = editdata.option.name || this.label
      if (this.option.layout == 'auto') {
        this.hideLabel = true
      }
    }
    // 文件上传单独格式化内容
    if (this.type == 'file') {
      if (!editdata.option) {
        editdata.option = {}
      }
      this.option.accept = editdata.option.accept || ''
      this.option.multiple = editdata.option.multiple || false
      this.option.multipleAppend = editdata.option.multipleAppend || false // 多选状态下多个文件中一个存在问题时的操作
      this.option.maxNum = editdata.option.maxNum || 0
      this.option.minNum = editdata.option.minNum || 0
      this.option.maxSize = editdata.option.maxSize || 0
      this.option.upload = editdata.option.upload || false
      this.option.layout = editdata.option.layout || false
      if (this.option.multiple) {
        this.setValueToArray()
      }
      if (this.option.upload) {
        if (this.func.post) {
          this.func.onFileUpload = ({ file }) => {
            return new Promise((resolve, reject) => {
              this.func.post({ file }).then(res => {
                resolve(res)
              }, err => {
                console.error(err)
                reject(err)
              })
            })
          }
        } else {
          _func.showmsg('未定义上传文件方法', 'error')
        }
      }
    }
    this.buildRules(editdata, opt)
    this.buildAutoFunc(opt)
  }
  checkFormValue (value, trim) {
    if (value !== undefined && value !== null && value !== this.getValueData('defaultdata')) {
      if (trim) {
        return this.checkFormValue(_func.trimData(value), false)
      } else {
        return false
      }
    } else {
      return true
    }
  }

  buildRules (editdata, opt) {
    if (editdata.rules) {
      this.rules = editdata.rules
    } else { // 初始化检验规则 无规则默认生成 // whitespace 必选时，空格是否会被视为错误
      this.rules = [
        {
          required: this.required,
          type: 'any',
          validator: (rule, value, callback) => {
            if (rule.required) {
              let fg = this.checkFormValue(value, this.trim)
              if (fg) {
                callback(rule.message)
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        }
      ]
    }
    // 此处判断存疑，可考虑删除
    // if (this.trim) {
    //   let trimRule = {
    //     required: this.required,
    //     type: 'any',
    //     validator: (rule, value, callback) => {
    //       if (rule.required) {
    //         if (value) {
    //           value = _func.trimData(value)
    //           if (!value) {
    //             callback(rule.message)
    //           } else {
    //             callback()
    //           }
    //         } else {
    //           callback(rule.message)
    //         }
    //       } else {
    //         callback()
    //       }
    //     }
    //   }
    //   this.rules.push(trimRule)
    // }
    // 无message自动生成
    let message = this.placeholder
    if (editdata.ruleMessage) {
      message = editdata.ruleMessage
    } else if (opt.rules && opt.rules.msg) {
      message = `${opt.rules.msg.front}${this.name}${opt.rules.msg.end}`
    }
    for (let n in this.rules) {
      if (!this.rules[n].message) {
        this.rules[n].message = message
      }
      // if (!this.rules[n].trigger) {
      //   if (opt.rules && opt.rules.trigger) {
      //     this.rules[n].trigger = opt.rules.trigger
      //   }
      // }
    }
    if (this.type == 'file') {
      if (this.option.minNum != 0) {
        let minNumRule = {
          required: this.required,
          type: 'any',
          message: `最小文件数量为${this.option.minNum}!`,
          validator: (rule, value, callback) => {
            if (rule.required && this.option.multiple) {
              if (value && value.length < this.option.minNum) {
                callback(rule.message)
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        }
        this.rules.push(minNumRule)
      }
      if (this.option.maxNum != 0) {
        let maxNumRule = {
          required: this.required,
          type: 'any',
          message: `最大文件数量为${this.option.maxNum}!`,
          validator: (rule, value, callback) => {
            if (rule.required && this.option.multiple) {
              if (value && value.length > this.option.maxNum) {
                callback(rule.message)
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        }
        this.rules.push(maxNumRule)
      }
    }
  }
  initValue (editdata, opt) {
    if (_func.hasProp(editdata, 'defaultdata')) {
      this.setValueData(editdata.defaultdata, 'defaultdata')
    } else {
      this.setValueData(opt.defaultdata, 'defaultdata')
    }
    if (_func.hasProp(editdata, 'initdata')) {
      this.value.initdata = editdata.initdata
    } else {
      this.value.initdata = this.value.defaultdata
    }
    if (_func.hasProp(editdata, 'resetdata')) {
      this.value.resetdata = editdata.resetdata
    } else {
      this.value.resetdata = this.value.defaultdata
    }
    this.value.list = []
    this.value.lastdata = undefined // 可能存在的使用
  }
  pushAutoFuncItem (funcItem) {
    if (funcItem && !this.func[funcItem.name]) {
      this.func._autoList.push(funcItem.name)
      if (funcItem.act == 'get') {
        if (!funcItem.unBindThis) {
          this.func[funcItem.name] = funcItem.data.call(this, funcItem.payload)
        } else {
          this.func[funcItem.name] = funcItem.data(funcItem.payload)
        }
      } else {
        if (!funcItem.unBindThis) {
          this.func[funcItem.name] = funcItem.data.bind(this)
        } else {
          this.func[funcItem.name] = funcItem.data
        }
      }
    }
  }
  isAutoFuncItem (name) {
    return this.func._autoList.indexOf(name) > -1
  }
  // 添加默认函数=> 此函数运行于最后时刻进行操作，生成阶段可以进行有无判断
  buildAutoFunc (opt) {
    let defaultList = [
      {
        act: 'get',
        name: 'onChangeEvent',
        data: eventFunc,
        payload: 'onChange'
      },
      {
        name: 'loadData',
        data: function (payload) {
          return new Promise((resolve, reject) => {
            if (this.func.getData) {
              this.func.getData(payload).then(res => {
                resolve(res)
              }, err => {
                console.error(err)
                reject(err)
              })
            } else {
              resolve({ status: 'success', msg: 'noGetData' })
            }
          })
        }
      }
    ]
    let funcList = defaultList.concat(opt.func)
    this.func._autoList = []
    for (let n in funcList) {
      let funcItem = funcList[n]
      this.pushAutoFuncItem(funcItem)
    }
  }
  loadData (force) {
    return new Promise((resolve, reject) => {
      let loadStatus = this.getStatus('load')
      if (loadStatus.value == 'unload' || force || this.reload) {
        if (this.func.loadData) {
          this.func.loadData().then(res => {
            resolve(res)
          }, err => {
            console.error(err)
            reject(err)
          })
        } else {
          resolve({ status: 'success', msg: 'noLoadData' })
        }
      } else {
        resolve({ status: loadStatus.value, msg: loadStatus.label })
      }
    })
  }
  readyData (force, payload) {
    // 设置value值
    this.setValueData([], 'list')
    this.loadData(force, payload).then(res => { }, err => {
      console.error(err)
    })
  }
  setValueToArray () {
    let proplist = ['initdata', 'defaultdata', 'resetdata']
    for (let n in proplist) {
      let prop = proplist[n]
      let type = _func.getType(this.getValueData(prop))
      if (type != 'array') {
        this.setValueData([], prop)
      }
    }
    this.setValueData([], 'defaultdata')
  }
  setValueData (data, prop = 'defaultdata') {
    this.value[prop] = data
  }
  getValueData (prop = 'defaultdata') {
    return this.value[prop]
  }

  _selfName () {
    return `[EditData]`
  }
}
export default EditData
