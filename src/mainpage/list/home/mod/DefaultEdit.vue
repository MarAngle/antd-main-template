<style scoped>

</style>
<template>
  <a-modal class="mainmodal" :title="title" v-model="currentShow" @ok="onMenu('ok')" @cancel="onMenu('cancel')">
    <div v-if="currentShow">
      <a-spin :spinning="false">
        <ComplexFormView
          :form="form"
          :mainlist="mainlist"
          :type="edit"
          :footMenu="menu"
          @menu="onFormMenu"
          @event="onFormEvent"
          @eventEnd="onFormEventEnd"
        >
          <span slot="outSlot" slot-scope="itemData" >
            <a-input v-bind="itemData.option.props" v-on="itemData.option.on" ></a-input>
          </span>
        </ComplexFormView>
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
        ref: null,
        data: {}
      },
      menu: [
        {
          name: '111',
          act: '1'
        }
      ]
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
    data: {
      type: [Object, Array],
      required: false,
      default: null
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
        // console.log(val)
      }
    }
  },
  mounted() {
  },
  methods: {
    onFormMenu(...args) {
      // console.log('menu', ...args)
    },
    onFormEventEnd(...args) {
      // console.log('end', ...args)
    },
    onFormEvent(...args) {
      // console.log('start', ...args)
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
        this.form.data = this.maindata.buildDictionaryFormData(this.modlist, this.type, this.data)
      } else if (this.edit == 'build') {
        this.form.data = this.maindata.buildDictionaryFormData(this.modlist, this.type)
      }
    },
    onMenu(act) {
      if (act == 'ok') {
        this.form.ref.validate(valid => {
          if (valid) {
            let postdata = this.maindata.getEditData(this.form.data, this.modlist, this.type)
            console.log(postdata)
          }
        })
        // this._func.postform({
        //   url: 'http://$local/upload',
        //   data: this.form.data
        // })
        this.maindata.triggerLife('buildCancel')
      } else {
      }
    }
  }
}
</script>
