<style>

</style>
<template>
  <div class="InstrcutionItem" >
    <div class="InstrcutionItemInfo" >
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          属性值
        </div>
        <div class="InstrcutionItemInfoItemContent">{{ data.prop }}</div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          描述
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div v-for="(val, index) in data.describe" :key="index">
            <p>{{ val }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: `InstrcutionItem`,
  props: {
    data: {
      type: Object,
      required: true
    },
    indent: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    pageLoad () {
    }
  }
}
</script>
