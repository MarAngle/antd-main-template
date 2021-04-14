<style lang='less' scoped>

.InstrcutionItem{
  h4,p{
    margin: 0;
    font-size: 14px;
    line-height: 24px;
    margin: 4px 0;
  }
  .InstrcutionItemInfo{
    .InstrcutionItemInfoItem{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      .InstrcutionItemInfoItemLabel{
        width: 60px;
        flex: none;
      }
      .InstrcutionItemInfoItemContent{
        width: 100%;
        flex: auto;
      }
    }
  }
}

</style>
<template>
  <div class="InstrcutionItem">
    <div class="InstrcutionItemInfo" >
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>属性</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.prop }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>类型</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.type || '-' }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>来源</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.from || '-' }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>必选</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.required ? '是' : '否' }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>描述</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div v-for="(val, index) in data.describe" :key="index">
            <p>{{ val }}</p>
          </div>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem" v-if="data.data" >
        <div class="InstrcutionItemInfoItemLabel">
          <h4>数据</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div v-for="(val, index) in data.data" :key="index">
            <InstrcutionItem :data="data.data" ></InstrcutionItem>
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
