// import {
//   Input,
//   InputNumber,
//   Button,
//   Switch,
//   Radio,
//   Checkbox,
//   Select,
//   FormModel,
//   Icon,
//   DatePicker,
//   TimePicker
// } from 'ant-design-vue'

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
      let mainprops = {
        prop: item.prop,
        colon: item.colon,
        rules: item.edit.rules,
        label: item.name
      }
      let props = {
        type: item.edit.option.type,
        allowClear: !item.edit.option.hideClear,
        maxLength: item.edit.option.maxLength,
        disabled: item.edit.disabled,
        placeholder: item.edit.placeholder,
        vOn: {
          change(e) {
          }
        }
      }
      let events = {}
      for (let funcName in item.edit.func) {
        events[funcName] = function() {
          let args = Array.prototype.slice.call(arguments)
          args.push(funcForm, funcPayload)
          item.edit.func[funcName].apply(this, args)
        }
      }
      return (
        <a-form-model-item {...{ props: mainprops }} >
          <a-input
            {...{ props: props, on: events }}
          />
        </a-form-model-item>
      )
    }
  },
  render () {
    const formList = this.mainlist.map((item, index) => {
      return this.renderItem(item, index)
    })
    return (
      <a-form-model>
        { formList }
      </a-form-model>
    )
  }
}
