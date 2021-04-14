<style lang='less' scoped>
.InstrcutionView{
  // border-radius: 4px;
  // border: 1px #ccc solid;
  // margin-top: 10px;
}
</style>
<template>
  <div class="InstrcutionView">
    <InstrcutionItem :data="data" :type="type">
      <template slot="default" slot-scope="slotProps">
        <InstrcutionView :data="slotProps.target" :type="type" ></InstrcutionView>
      </template>
      <template slot="target" slot-scope="slotProps">
        <InstrcutionView :data="slotProps.target" :type="type" ></InstrcutionView>
      </template>
    </InstrcutionItem>
  </div>
</template>

<script>
import InstrcutionItem from './InstrcutionItem'
export default {
  name: `InstrcutionView`,
  components: {
    InstrcutionItem
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'data'
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
