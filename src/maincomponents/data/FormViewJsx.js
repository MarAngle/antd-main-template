export default {
  name: 'FormViewJsx',
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
      let funcForm = this.form.data

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
          form: funcForm
        })
      }
      let renderItem = (
        <a-form-model-item {...mainOption } >
          {this.renderTypeItem(item, index)}
        </a-form-model-item>
      )
      return renderItem
    },
    renderTypeItem(item, index) {
      let funcPayload = {
        index: index,
        item: item,
        list: this.mainlist,
        target: this
      }
      let funcForm = this.form.data
      let itemOption = {
        on: {}
      }
      for (let funcName in item.edit.func) {
        itemOption.on[funcName] = function() {
          let args = Array.prototype.slice.call(arguments)
          args.push(funcForm, funcPayload)
          item.edit.func[funcName].apply(this, args)
        }
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
        renderTypeItem = (
          <a-input-number
            {...itemOption}
          />
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
        layout: this.layout,
        labelAlign: this.labelAlign,
        validateOnRuleChange: this.validateOnRuleChange,
        vModel: this.form.data
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
