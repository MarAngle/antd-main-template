<style lang='less' scoped>

</style>
<template>
  <div class="mainpage" >
    <InstrcutionView :data="maindata" />
  </div>
</template>

<script>
import { ListData } from 'complex-data'
import InstrcutionView from 'complex-data/src/components/InstrcutionView'
let maindata = ListData.getInstrcution('data')

console.log(maindata)

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
