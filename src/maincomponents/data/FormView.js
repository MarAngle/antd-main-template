import _func from '@/maindata/func/index'
import moment from 'moment'
import FileView from './../mod/FileView'
class EventData {
  constructor () {
    this.data = {
    }
    this.on = {}
  }
  build(name, list = []) {
    this.data[name] = list
    this.on[name] = (...args) => {
      this.trigger(name, ...args)
    }
  }
  add(name, data, method = 'push') {
    if (!this.data[name]) {
      this.build(name)
    }
    this.data[name][method](data)
  }
  trigger(name, ...args) {
    if (this.data[name]) {
      for (let n = 0; n < this.data[name].length; n++) {
        this.data[name][n](...args)
      }
    }
  }
  getData() {
    return this.on
  }
}

let showLogs = {
  init: false,
  model: false
}

const funcList = {
  valueInit: function (itemOption, formData, prop) {
    if (showLogs.init) { console.log(itemOption, formData, prop) }
    itemOption.props.value = formData[prop]
  },
  checkInit: function (itemOption, formData, prop) {
    if (showLogs.init) { console.log(itemOption, formData, prop) }
    itemOption.props.checked = formData[prop]
  },
  input: function (formdata, prop, args) {
    if (showLogs.model) { console.log(formdata, prop, args) }
    formdata[prop] = args[0].target.value
  },
  select: function (formdata, prop, args) {
    if (showLogs.model) { console.log(formdata, prop, args) }
    formdata[prop] = args[0]
  },
  change: function (formdata, prop, args) {
    if (showLogs.model) { console.log(formdata, prop, args) }
    formdata[prop] = args[0]
  }
}

function formatMoment(data, propList, formatList) {
  for (let n = 0; n < propList.length; n++) {
    let prop = propList[n]
    if (data[prop]) {
      let type = _func.getType(data[prop])
      if (type == 'array') {
        for (let i = 0; i < data[prop].length; i++) {
          data[prop][i] = formatMomentNext(data[prop][i], formatList[n])
        }
      } else {
        data[prop] = formatMomentNext(data[prop], formatList[n])
      }
    }
  }
}

function formatMomentNext(value, format) {
  if (value) {
    if (moment.isMoment(value)) {
      return value
    } else {
      return moment(value, format)
    }
  } else {
    return value
  }
}

let typeFormat = {
  base: {
    func: {
      init: funcList.valueInit,
      data: {
        change: funcList.change
      }
    },
    option: function(itemOption, item, payload) {
      return itemOption
    }
  },
  data: {
    ainput: {
      func: {
        data: {
          input: funcList.input
        }
      },
      option: function(itemOption, item, payload) {
        itemOption.props = {
          type: item.edit.option.type,
          allowClear: !item.edit.option.hideClear,
          maxLength: item.edit.option.maxLength,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        typeFormat.buildFunc(this, itemOption, item, payload)
        itemOption = _func.mergeData(itemOption, item.edit.localOption.item)
        return itemOption
      }
    },
    ainputNumber: {
      func: {
        data: {
          input: funcList.input
        }
      },
      option: function(itemOption, item, payload) {
        itemOption.props = {
          min: item.edit.option.min,
          max: item.edit.option.max,
          precision: item.edit.option.precision,
          step: item.edit.option.step,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        typeFormat.buildFunc(this, itemOption, item, payload)
        itemOption = _func.mergeData(itemOption, item.edit.localOption.item)
        return itemOption
      }
    },
    aswitch: {
      func: {
        init: funcList.checkInit
      },
      option: function(itemOption, item, payload) {
        itemOption.props = {
          disabled: item.edit.disabled
        }
        typeFormat.buildFunc(this, itemOption, item, payload)
        itemOption = _func.mergeData(itemOption, item.edit.localOption.item)
        return itemOption
      }
    },
    aselect: {
      func: {},
      option: function(itemOption, item, payload) {
        itemOption.props = {
          mode: item.edit.option.mode,
          showSearch: item.edit.option.search.show,
          showArrow: !item.edit.option.hideArrow,
          allowClear: !item.edit.option.hideClear,
          dropdownMatchSelectWidth: item.edit.option.autoWidth,
          notFoundContent: item.edit.option.noDataContent,
          filterOption: item.edit.option.filterOption,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        typeFormat.buildFunc(this, itemOption, item, payload)
        itemOption = _func.mergeData(itemOption, item.edit.localOption.item)
        return itemOption
      }
    },
    adate: {
      func: {},
      option: function(itemOption, item, payload) {
        itemOption.props = {
          format: item.edit.option.format,
          showTime: item.edit.option.showTime,
          disabledDate: item.edit.option.disabledDate,
          disabledTime: item.edit.option.disabledTime,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        typeFormat.buildFunc(this, itemOption, item, payload)
        itemOption = _func.mergeData(itemOption, item.edit.localOption.item)
        formatMoment(itemOption.props, ['value', 'defaultValue'], [itemOption.props.formatedit, itemOption.props.formatedit])
        if (itemOption.props.showTime) {
          formatMoment(itemOption.props.showTime, ['defaultValue', 'defaultOpenValue'], [itemOption.props.showTime.format, itemOption.props.showTime.format])
        }
        return itemOption
      }
    },
    adateRange: {
      func: {},
      option: function(itemOption, item, payload) {
        itemOption.props = {
          format: item.edit.option.format,
          showTime: item.edit.option.showTime,
          separator: item.edit.option.separator,
          disabledDate: item.edit.option.disabledDate,
          disabledTime: item.edit.option.disabledTime,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        typeFormat.buildFunc(this, itemOption, item, payload)
        itemOption = _func.mergeData(itemOption, item.edit.localOption.item)
        formatMoment(itemOption.props, ['value', 'defaultValue'], [itemOption.props.formatedit, itemOption.props.formatedit])
        if (itemOption.props.showTime) {
          formatMoment(itemOption.props.showTime, ['defaultValue', 'defaultOpenValue'], [itemOption.props.showTime.format, itemOption.props.showTime.format])
        }
        return itemOption
      }
    },
    afile: {
      func: {},
      option: function(itemOption, item, payload) {
        let layout = item.edit.option.layout
        if (layout == 'auto') {
          if (this.layout == 'inline') {
            layout = 'end'
          } else {
            layout = 'bottom'
          }
        }
        itemOption.props = {
          accept: item.edit.option.accept,
          multiple: item.edit.option.multiple,
          multipleAppend: item.edit.option.multipleAppend,
          maxNum: item.edit.option.maxNum,
          minNum: item.edit.option.minNum,
          maxSize: item.edit.option.maxSize,
          upload: item.edit.option.upload,
          fileUpload: item.edit.option.fileUpload,
          layout: layout,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        typeFormat.buildFunc(this, itemOption, item, payload)
        itemOption = _func.mergeData(itemOption, item.edit.localOption.item)
        return itemOption
      }
    },
    abutton: {
      func: {
        init: false,
        data: {}
      },
      option: function(itemOption, item, payload) {
        return itemOption
      }
    },
    aslot: {
      func: {
        init: false,
        data: {}
      },
      option: function(itemOption, item, payload) {
        return itemOption
      }
    }
  }
}

typeFormat.init = function() {
  for (let n in this.data) {
    let item = this.data[n]
    if (!item.option) {
      item.option = this.base.option
    }
    if (!item.func) {
      item.func = {}
    }
    if (item.func.init === undefined) {
      item.func.init = this.base.func.init
    }
    if (!item.func.data) {
      item.func.data = {}
      for (let i in this.base.func.data) {
        item.func.data[i] = this.base.func.data[i]
      }
    }
  }
}

typeFormat.getFunc = function(type) {
  let typeName = 'a' + type
  if (this.data[typeName]) {
    return this.data[typeName].func
  } else {
    return this.base.func
  }
}
typeFormat.getData = function(type) {
  let typeName = 'a' + type
  if (this.data[typeName]) {
    return this.data[typeName]
  } else {
    return this.base
  }
}

typeFormat.buildFunc = function(typeData, itemOption, item, payload) {
  let formData = payload.formData
  let funcData = typeData.func
  if (funcData.init) {
    funcData.init(itemOption, formData, item.prop)
  }
  let onEvent = new EventData()
  // 加载双向绑定逻辑
  for (let funcName in funcData.data) {
    onEvent.add(funcName, function (...args) {
      funcData.data[funcName](formData, item.prop, args)
    })
  }
  // 加载单独设置的事件监控
  for (let funcName in item.edit.on) {
    onEvent.add(funcName, function (...args) {
      args.push(payload)
      item.edit.on[funcName](...args)
    })
  }
  // 加载需要的独立触发的规则检查
  if (item.edit.autoTrigger) {
    for (let i in item.edit.autoTrigger) {
      let funcName = item.edit.autoTrigger[i]
      onEvent.add(funcName, function () {
        payload.target.triggerRuleCheck(payload.prop)
      })
    }
  }
  itemOption.on = onEvent.getData()
}

typeFormat.init()

export default {
  name: 'FormView',
  props: {
    layout: { // 表单布局	'horizontal'|'vertical'|'inline'
      type: String,
      required: false,
      default: 'horizontal'
    },
    labelAlign: { // label 标签的文本对齐方式
      type: String,
      required: false,
      default: 'right'
    },
    checkOnRuleChange: { // 是否在 rules 属性改变后立即触发一次验证
      type: Boolean,
      required: false,
      default: true
    },
    checkOnInit: {
      type: Boolean,
      required: false,
      default: false
    },
    clearCheckOnInit: {
      type: Boolean,
      required: false,
      default: true
    },
    form: {
      type: Object,
      required: true
    },
    mainlist: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      this.setFormRef(this.checkOnInit, this.clearCheckOnInit)
    })
  },
  watch: {
  },
  methods: {
    setFormRef(check, clear) {
      this.form.ref = this.$refs.formView
      if (check) {
        this.triggerRuleCheck()
      } else if (clear) {
        this.clearRuleCheck()
      }
    },
    clearRuleCheck(prop) {
      if (this.form.ref) {
        this.form.ref.clearValidate(prop)
      }
    },
    resetRuleCheck() {
      if (this.form.ref) {
        this.form.ref.resetFields()
      }
    },
    triggerRuleCheck(prop) {
      if (this.form.ref) {
        if (prop) {
          this.form.ref.validateField(prop)
        } else {
          this.form.ref.validate()
        }
      }
    },
    // forviewItem模板
    renderItem(item, index) {
      let renderItem = null
      let payload = {
        form: this.form,
        formData: this.form.data,
        prop: item.prop,
        item: item,
        list: this.mainlist,
        index: index,
        target: this
      }
      let mainSlot = this.$scopedSlots[item.edit.slot.name]
      if (item.edit.slot.type != 'main') {
        let mainOption = {
          props: {
            prop: item.prop,
            colon: item.colon,
            rules: item.edit.rules,
            label: item.name
          }
        }
        if (item.layout.type == 'grid') {
          if (_func.getType(item.layout.data.label) == 'object') {
            mainOption.props.labelCol = item.layout.data.label
          } else {
            mainOption.props.labelCol = {
              span: item.layout.data.label
            }
          }
          if (_func.getType(item.layout.data.content) == 'object') {
            mainOption.props.wrapperCol = item.layout.data.content
          } else {
            mainOption.props.wrapperCol = {
              span: item.layout.data.content
            }
          }
        }
        if (this.$scopedSlots[item.edit.slot.label]) {
          mainOption.props.label = this.$scopedSlots[item.edit.slot.label]({
            ...payload
          })
        }
        mainOption = this._func.mergeData(mainOption, item.edit.localOption.main)
        renderItem = (
          <a-form-model-item {...mainOption} >
            {this.renderTip(item, mainSlot, payload)}
          </a-form-model-item>
        )
      } else {
        if (mainSlot) {
          renderItem = mainSlot({
            ...payload
          })
        } else {
          console.error(`${item.prop}/${item.name}需要设置插槽!`)
        }
      }
      return renderItem
    },
    // tips模板
    renderTip(item, mainSlot, payload) {
      let typeItem = null
      if (mainSlot && (item.edit.slot.type == 'auto' || item.edit.slot.type == 'item')) {
        typeItem = mainSlot({
          ...payload
        })
      } else {
        typeItem = this.renderTypeItem(item, mainSlot, payload)
      }
      if (item.edit.tips.props.title) {
        return (
          <a-tooltip {...item.edit.tips} >
            { typeItem }
          </a-tooltip>
        )
      } else {
        return typeItem
      }
    },
    autoSetItemWidth(itemOption, width) {
      if (!itemOption.style) {
        itemOption.style = {}
      }
      if (!itemOption.style.width) {
        if (_func.getType(width) == 'number') {
          itemOption.style.width = width + 'px'
        } else {
          itemOption.style.width = width
        }
      }
      console.log(itemOption.style)
    },
    // type模板
    renderTypeItem(item, mainSlot, payload) {
      let itemOption = {
        on: {}
      }
      let renderTypeItem = null
      let typeFormatData = typeFormat.getData(item.edit.type)
      itemOption = typeFormatData.option(itemOption, item, payload)
      if (item.layout.type == 'width') {
        this.autoSetItemWidth(itemOption, item.layout.data.width)
      } else if (item.edit.option.innerWidth) {
        this.autoSetItemWidth(itemOption, item.edit.option.innerWidth)
      }
      if (mainSlot && item.edit.slot.type == 'model') {
        renderTypeItem = mainSlot({
          ...payload,
          option: itemOption
        })
      } else if (item.edit.type == 'input') {
        renderTypeItem = (
          <a-input
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'inputNumber') {
        renderTypeItem = (
          <a-input-number
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'switch') {
        renderTypeItem = (
          <a-switch
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'select') {
        let dict = {
          key: item.edit.option.optionValue || 'value',
          value: item.edit.option.optionValue || 'value',
          label: item.edit.option.optionLabel || 'label',
          disabled: item.edit.option.optionDisabled || 'disabled'
        }
        let optionList = item.edit.option.list.map((itemData, indexData) => {
          let optionOption = {
            props: {
              key: itemData[dict.key],
              value: itemData[dict.value],
              disabled: itemData[dict.disabled] || false
            }
          }
          optionOption = this._func.mergeData(optionOption, item.edit.localOption.option)
          return <a-select-option {...optionOption}>{itemData[dict.label]}</a-select-option>
        })
        if (item.edit.pagination) {
          let defaultProps = {
            simple: true,
            paddingTop: 5,
            paddingBittom: 10
          }
          let paginationOption = {
            props: {
              paginationdata: item.edit.pagination,
              ...defaultProps
            },
            on: {
              change: function (...args) {
                item.edit.func.page(...args)
              }
            }
          }
          paginationOption = this._func.mergeData(paginationOption, item.edit.localOption.pagination)
          let paginationAreaOption = {
            style: {
              borderTop: '1px #ccc solid',
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '4px 12px',
              alignItems: 'center'
            },
            on: {
              mousedown: function (e) {
                e.preventDefault()
              }
            }
          }
          paginationAreaOption = this._func.mergeData(paginationAreaOption, item.edit.localOption.paginationArea)
          let pagination = <localPaginationView {...paginationOption} />
          itemOption.props.dropdownRender = (menuNode, props) => {
            return (
              <div>
                <div>
                  {menuNode}
                </div>
                <div {...paginationAreaOption}>
                  {pagination}
                </div>
              </div>
            )
          }
        }
        renderTypeItem = (
          <a-select
            {...itemOption}
          >
            { optionList}
          </a-select>
        )
      } else if (item.edit.type == 'date') {
        renderTypeItem = (
          <a-date-picker
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'dateRange') {
        renderTypeItem = (
          <a-range-picker
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'file') {
        renderTypeItem = (
          <FileView
            {...itemOption}
          />
        )
      }
      return renderTypeItem
    }
  },
  render() {
    const formList = this.mainlist.map((item, index) => {
      return this.renderItem(item, index)
    })
    let option = {
      props: {
        model: this.form.data,
        layout: this.layout,
        labelAlign: this.labelAlign,
        validateOnRuleChange: this.checkOnRuleChange
      },
      ref: 'formView'
    }
    let render = (
      <a-form-model {...option}>
        { formList}
      </a-form-model>
    )
    return render
  }
}
