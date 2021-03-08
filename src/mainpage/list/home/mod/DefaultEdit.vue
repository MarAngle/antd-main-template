<style scoped>

</style>
<template>
  <a-modal class="mainmodal" :title="title" v-model="currentShow" @ok="onMenu('ok')" @cancel="onMenu('cancel')">
    <div v-if="currentShow">
      <a-spin :spinning="false">
        <LocalFormViewJsx :form="form" :mainlist="mainlist">
          <span slot="terminalCode-label" slot-scope="data">{{ data.index }}</span>
        </LocalFormViewJsx>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>

export default {
  name: `DefaultEdit`,
  components: {
  },
  data () {
    return {
      currentShow: false,
      modlist: [],
      mainlist: [],
      form: {
        data: {}
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    maindata: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: true
    },
    edit: {
      type: String,
      required: false,
      default: 'change'
    },
    index: {
      type: Number,
      required: false,
      default: 0
    }
  },
  watch: {
    show: function(val) {
      if (val) {
        this.initData()
        this.currentShow = true
      } else {
        this.currentShow = false
      }
    },
    currentShow: function(val) {
      this.$emit('update:show', val)
    },
    'form.data': {
      deep: true,
      handler: function(val) {
        console.log(val)
      }
    }
  },
  mounted() {
  },
  methods: {
    initMainList() {
      this.modlist = this.maindata.getDictionaryModList(this.type)
      let mainlist = this.maindata.getDictionaryPageListByModList(this.type, this.modlist, {
        mod: this.edit
      })
      this.mainlist = mainlist
    },
    initData() {
      this.initMainList()
      if (this.edit == 'change') {
        let targetitem = this.maindata.getItem(this.index)
        this.form.data = this.maindata.getDictionaryFormData(this.modlist, this.type, targetitem)
      } else if (this.edit == 'build') {
        // this.maindata.buildModFormData(this.modlist, this.type)
        this.form.data = this.maindata.getDictionaryFormData(this.modlist, this.type)
      }
      console.log(this.form.data)
    }
  }
}
</script>
