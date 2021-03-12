<style scoped>

</style>
<template>
  <a-modal class="mainmodal" :title="title" v-model="currentShow" @ok="onMenu('ok')" @cancel="onMenu('cancel')">
    <div v-if="currentShow">
      <a-spin :spinning="false">
        <LocalFormView :form="form" :mainlist="mainlist">
          <!-- <span slot="terminalCode-label" slot-scope="data">{{ data.index }}</span> -->
          <!-- <a-input slot="terminalCode" slot-scope="data" >{{ showData(data) }}|</a-input> -->
          <span slot="requestTimes" slot-scope="data" >
            <a-input v-bind="data.option.props" v-on="data.option.on" ></a-input>
          </span>
        </LocalFormView>
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
    onChange(a, b, c) {
      console.log(a, b, c)
    },
    showData(data) {
      console.log(data)
    },
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
        this.form.data = this.maindata.getDictionaryFormData(this.modlist, this.type)
      }
      console.log('---')
    },
    onMenu() {
      console.log(this.form.data)
    }
  }
}
</script>
