<style lang='less' scoped>

</style>
<template>
  <a-form-model
    :class="'formview formview-' + layout"
    ref="formview"
    :layout="layout"
    :labelAlign="labelAlign"
    :validateOnRuleChange="validateOnRuleChange"
    :model="form.data"
  >
    <a-form-model-item
      v-for="(item, k) in mainlist"
      :key="item.prop"
      :prop="item.prop"
      :colon="item.colon"
      :rules="item.edit.rules"
    >
      <template slot="label">
        <slot :name="item.edit.slot.label" :data="item" :index="k">
          <span>{{ item.name }}</span>
        </slot>
      </template>
      <a-tooltip
        :placement="item.edit.tips.placement"
        :trigger="item.edit.tips.trigger"
        :title="item.edit.tips.data"
      >
        <slot :name="item.edit.slot.name" :data="item" :index="k">
          <span v-if="item.edit.slot.front">
            <slot :name="item.edit.slot.front" :data="item" :index="k"></slot>
          </span>
          <a-input
            v-if="item.edit.type == 'input'"
            v-model="form.data[item.prop]"
            :type="item.edit.option.type"
            :allowClear="!item.edit.option.hideClear"
            :maxLength="item.edit.option.maxLength"
            :disabled="item.edit.disabled"
            :placeholder="item.edit.placeholder"
            @change="onItemEvent(form.data[item.prop], item, 'onChangeEvent')"
          >
          </a-input>
          <span v-if="item.edit.slot.end">
            <slot :name="item.edit.slot.end" :data="item" :index="k"></slot>
          </span>
        </slot>
      </a-tooltip>
    </a-form-model-item>
  </a-form-model>
</template>

<script>

export default {
  name: 'FormView',
  data () {
    return {
    }
  },
  computed: {
  },
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
  mounted() {
    // this.pageLoad()
  },
  destroyed() {
    // this.destroyForm()
  },
  methods: {
  }
}
</script>
