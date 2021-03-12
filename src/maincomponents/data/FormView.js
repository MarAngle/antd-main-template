import form from '@/locales/lang/en-US/form'
import _func from '@/maindata/func/index'
import moment from 'moment'
import FileView from './../mod/FileView'

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

const formatFunc = {
  base: {
    init: funcList.valueInit,
    data: {
      change: funcList.change
    }
  },
  data: {
    ainput: {
      data: {
        input: funcList.input
      }
    },
    ainputNumber: {
      data: {
        input: funcList.input
      }
    },
    aswitch: {
      init: funcList.checkInit
    },
    aselect: {
    },
    adate: {
    },
    adateRange: {
    },
    afile: {
    },
    abutton: {
      init: false,
      data: {}
    },
    aslot: {
      init: false,
      data: {}
    }
  }
}
formatFunc.init = function() {
  for (let n in this.data) {
    let item = this.data[n]
    if (item.init === undefined) {
      item.init = this.base.init
    }
    if (!item.data) {
      item.data = {}
      for (let i in this.base.data) {
        item.data[i] = this.base.data[i]
      }
    }
  }
}
formatFunc.getFunc = function(type) {
  let typeName = 'a' + type
  if (this.data[typeName]) {
    return this.data[typeName]
  } else {
    return this.base.data
  }
}
formatFunc.init()

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
    validateOnRuleChange: { // 是否在 rules 属性改变后立即触发一次验证
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
  },
  watch: {
  },
  methods: {
    // forviewItem模板
    renderItem(item, index) {
      let renderItem = null
      if (!item.edit.slot.main) {
        let mainOption = {
          props: {
            prop: item.prop,
            colon: item.colon,
            rules: item.edit.rules,
            label: item.name
          }
        }
        if (this.$scopedSlots[item.edit.slot.label]) {
          mainOption.props.label = this.$scopedSlots[item.edit.slot.label]({
            item: item,
            list: this.mainlist,
            index: index,
            form: this.form.data,
            prop: item.prop,
            target: this
          })
        }
        mainOption = this._func.mergeData(mainOption, item.edit.localOption.main)
        renderItem = (
          <a-form-model-item {...mainOption} >
            {this.renderTip(item, index)}
          </a-form-model-item>
        )
      } else {
        let mainSlot = this.$scopedSlots[item.edit.slot.name]
        if (mainSlot) {
          renderItem = mainSlot({
            item: item,
            list: this.mainlist,
            index: index,
            form: this.form.data,
            prop: item.prop,
            target: this
          })
        } else {
          console.error(`${item.prop}/${item.name}需要设置插槽!`)
        }
      }
      return renderItem
    },
    // tips模板
    renderTip(item, index) {
      let typeItem = null
      let itemSlot = this.$scopedSlots[item.edit.slot.name]
      if (itemSlot) {
        typeItem = itemSlot({
          item: item,
          list: this.mainlist,
          index: index,
          form: this.form.data,
          prop: item.prop,
          target: this
        })
      } else {
        typeItem = this.renderTypeItem(item, index)
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
    buildFunc(type, itemOption, item, index) {
      let funcPayload = {
        index: index,
        item: item,
        list: this.mainlist,
        target: this
      }
      let formData = this.form.data
      let funcData = formatFunc.getFunc(type)
      if (funcData.init) {
        funcData.init(itemOption, formData, item.prop)
      }
      for (let funcName in item.edit.on) {
        let itemFunc = function (...args) {
          args.push(formData, funcPayload)
          this.$emit('func', item.prop, funcName, ...args)
          item.edit.on[funcName](...args)
        }
        if (funcData.data[funcName]) {
          itemOption.on[funcName] = function (...args) {
            console.log(funcName, args)
            funcData.data[funcName](formData, item.prop, args)
            itemFunc(...args)
          }
        } else {
          itemOption.on[funcName] = itemFunc
        }
      }
      for (let triggerFuncName in funcData.data) {
        if (!itemOption.on[triggerFuncName]) {
          itemOption.on[triggerFuncName] = function (...args) {
            funcData.data[triggerFuncName](formData, item.prop, args)
          }
        }
      }
    },
    // type模板
    renderTypeItem(item, index) {
      let itemOption = {
        on: {}
      }
      let renderTypeItem = null
      if (item.edit.type == 'input') {
        itemOption.props = {
          type: item.edit.option.type,
          allowClear: !item.edit.option.hideClear,
          maxLength: item.edit.option.maxLength,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
        itemOption = this._func.mergeData(itemOption, item.edit.localOption.item)
        renderTypeItem = (
          <a-input
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'inputNumber') {
        itemOption.props = {
          min: item.edit.option.min,
          max: item.edit.option.max,
          precision: item.edit.option.precision,
          step: item.edit.option.step,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
        itemOption = this._func.mergeData(itemOption, item.edit.localOption.item)
        renderTypeItem = (
          <a-input-number
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'switch') {
        itemOption.props = {
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
        itemOption = this._func.mergeData(itemOption, item.edit.localOption.item)
        renderTypeItem = (
          <a-switch
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'select') {
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
        this.buildFunc(item.edit.type, itemOption, item, index)
        itemOption = this._func.mergeData(itemOption, item.edit.localOption.item)
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
        itemOption.props = {
          format: item.edit.option.format,
          showTime: item.edit.option.showTime,
          disabledDate: item.edit.option.disabledDate,
          disabledTime: item.edit.option.disabledTime,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
        itemOption = this._func.mergeData(itemOption, item.edit.localOption.item)
        formatMoment(itemOption.props, ['value', 'defaultValue'], [itemOption.props.formatedit, itemOption.props.formatedit])
        if (itemOption.props.showTime) {
          formatMoment(itemOption.props.showTime, ['defaultValue', 'defaultOpenValue'], [itemOption.props.showTime.format, itemOption.props.showTime.format])
        }
        renderTypeItem = (
          <a-date-picker
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'dateRange') {
        itemOption.props = {
          format: item.edit.option.format,
          showTime: item.edit.option.showTime,
          separator: item.edit.option.separator,
          disabledDate: item.edit.option.disabledDate,
          disabledTime: item.edit.option.disabledTime,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
        itemOption = this._func.mergeData(itemOption, item.edit.localOption.item)
        formatMoment(itemOption.props, ['value', 'defaultValue'], [itemOption.props.formatedit, itemOption.props.formatedit])
        if (itemOption.props.showTime) {
          formatMoment(itemOption.props.showTime, ['defaultValue', 'defaultOpenValue'], [itemOption.props.showTime.format, itemOption.props.showTime.format])
        }
        renderTypeItem = (
          <a-range-picker
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'file') {
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
        this.buildFunc(item.edit.type, itemOption, item, index)
        itemOption = this._func.mergeData(itemOption, item.edit.localOption.item)
        renderTypeItem = (
          <FileView
            {...itemOption}
          />
        )
      }
      // console.log(this.$scopedSlots[item.prop])
      // if (this.$scopedSlots[item.prop]) {
      //   let mainSlot = this.$scopedSlots[item.prop](itemOption)
      //   renderTypeItem = (
      //     { mainSlot }
      //   )
      // }
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
        validateOnRuleChange: this.validateOnRuleChange
      }
    }
    let render = (
      <a-form-model {...option}>
        { formList}
      </a-form-model>
    )
    return render
  }
}
