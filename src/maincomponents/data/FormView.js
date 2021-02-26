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
      let 
      return (
        <a-form-model-item>
          <a-input
            v-if="item.edit.type == 'input'"
            vModel="form.data[item.prop]"
            :type="item.edit.option.type"
            :allowClear="!item.edit.option.hideClear"
            :maxLength="item.edit.option.maxLength"
            :disabled="item.edit.disabled"
            :placeholder="item.edit.placeholder"
            @change="onItemEvent(form.data[item.prop], item, 'onChangeEvent')"
          >
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

      </a-form-model>
    )
  }
}
