<style lang='less' scoped >
.InfoView{
  padding: 10px 10px;
}
</style>
<template>
  <div class="InfoView">
    <div class="listArea">
      <div class="item" v-for="(val, index) in mainlist" :key="val.prop" >
        <div class="itemLabel">
          <slot :name="val.prop + '-label'" :data="val" :index="index" >
            <p>{{ val.label }}</p>
          </slot>
        </div>
        <div class="itemContent">
          <slot :name="val.prop + '-content'" :data="val" :index="index" >
            <p>{{ val.data }}</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InfoView',
  data() {
    return {
      mainlist: []
    }
  },
  props: {
    maindata: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: false
    },
    type: {
      type: String,
      required: false,
      default: 'info'
    }
  },
  computed: {
    currentData: function() {
      let currentData
      if (!this.data) {
        currentData = this.maindata.data.current
      } else {
        currentData = this.data
      }
      return currentData
    }
  },
  watch: {
    currentData: {
      immediate: true,
      deep: true,
      handler: function() {
        this.buildMainList()
      }
    }
  },
  mounted() {
    this.pageLoad()
  },
  methods: {
    buildMainList () {
      this.mainlist = this.maindata.getDictionaryPageList(this.type, {
        targetitem: this.currentData
      })
    },
    pageLoad() {
    }
  }
}
</script>
