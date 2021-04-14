<style>

</style>
<template>
  <div>
    <InstrcutionItem :data="data" :indent="10" />
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
