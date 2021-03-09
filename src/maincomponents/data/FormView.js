
const funcList = {
  valueInit: function(itemOption, formData, prop) {
    itemOption.props.value = formData[prop]
  },
  input: function(formdata, prop, args) {
    formdata[prop] = args[0].target.value
  },
  select: function(formdata, prop, args) {
    formdata[prop] = args[0]
  }
}

const formatFunc = {
  ainput: {
    init: funcList.valueInit,
    data: {
      input: funcList.input
    }
  },
  ainputNumber: {
    init: funcList.valueInit,
    data: {
      input: funcList.input
    }
  },
  aselect: {
    init: funcList.valueInit,
    data: {
      select: funcList.select
    }
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
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    renderItem(item, index) {
      let funcPayload = {
        index: index,
        item: item,
        list: this.mainlist,
        target: this
      }
      let formData = this.form.data

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
          ...funcPayload,
          form: formData
        })
      }
      let renderItem = (
        <a-form-model-item {...mainOption } >
          {this.renderTypeItem(item, index)}
        </a-form-model-item>
      )
      return renderItem
    },
    buildFunc(type, itemOption, item, index) {
      let funcPayload = {
        index: index,
        item: item,
        list: this.mainlist,
        target: this
      }
      let formData = this.form.data
      let funcData = formatFunc['a' + type]
      funcData.init(itemOption, formData, item.prop)
      itemOption.props.value = this.form.data[item.prop]
      for (let funcName in item.edit.on) {
         let itemFunc = function() {
          let args = Array.prototype.slice.call(arguments)
          args.push(formData, funcPayload)
          item.edit.on[funcName].apply(this, args)
        }
        if (funcData.data[funcName]) {
          itemOption.on[funcName] = function() {
            let args = Array.prototype.slice.call(arguments)
            funcData.data[funcName](formData, item.prop, args)
            itemFunc.apply(this, args)
          }
        } else {
          itemOption.on[funcName] = itemFunc
        }
      }
      for (let triggerFuncName in funcData.data) {
        if (!itemOption.on[triggerFuncName]) {
          itemOption.on[triggerFuncName] = function() {
            let args = Array.prototype.slice.call(arguments)
            funcData.data[triggerFuncName](formData, item.prop, args)
          }
        }
      }
    },
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
          placeholder: item.edit.placeholder,
          ...item.edit.props
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
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
          placeholder: item.edit.placeholder,
          ...item.edit.props
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
        renderTypeItem = (
          <a-input-number
            {...itemOption}
          />
        )
      } else if (item.edit.type == 'select') {
        itemOption.props = {
          showSearch: item.edit.option.search.show,
          showArrow: !item.edit.option.hideArrow,
          allowClear: !item.edit.option.hideClear,
          dropdownMatchSelectWidth: item.edit.option.autoWidth,
          notFoundContent: item.edit.option.noDataContent,
          disabled: item.edit.disabled,
          placeholder: item.edit.placeholder,
          ...item.edit.props
        }
        this.buildFunc(item.edit.type, itemOption, item, index)
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
              disabled: itemData[dict.disabled]
            }
          }
          return <a-select-option { ... optionOption }>{ itemData[dict.label] }</a-select-option>
        })
        renderTypeItem = (
          <a-select
            {...itemOption}
          >
            { optionList }
          </a-select>
        )
      }
      return renderTypeItem
    }
  },
  render () {
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
        { formList }
      </a-form-model>
    )
    return render
  }
}
