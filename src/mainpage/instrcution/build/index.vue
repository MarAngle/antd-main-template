<style lang='less' scoped>

</style>
<template>
  <div class="mainpage" >
    <InstrcutionView :data="maindata" :type="'build'" />
  </div>
</template>

<script>
import { ListData } from 'complex-data'
import InstrcutionView from '@/MainPlugin/complex-data-option-antd/src/components/InstrcutionView'
let maindata = ListData.getInstrcution('build')

export default {
  name: `mainlist`,
  components: {
    InstrcutionView
  },
  data () {
    return {
      maindata: maindata
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
