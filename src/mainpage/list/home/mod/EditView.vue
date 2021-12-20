<style lang='less' scoped>

</style>
<template>
  <div>
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
</template>

<script>

export default {
  name: `EditView`,
  data () {
    return {
      type: '',
      edit: '',
      data: null,
      modlist: [],
      mainlist: [],
      form: {
        ref: null,
        data: {}
      },
      menu: [
        {
          name: '页面定义按钮',
          act: 'pageMenu'
        }
      ]
    }
  },
  props: {
    maindata: {
      type: Object,
      required: true
    },
    maxHeight: {
      type: Number,
      required: true
    }
  },
  methods: {
    onFormMenu(...args) {
      console.log('menu', ...args)
      console.log(this.form.data)
    },
    onFormEventEnd(...args) {
      console.log('end', ...args)
    },
    onFormEvent(...args) {
      console.log('start', ...args)
    },
    show(type, edit, data) {
      this.type = type
      this.edit = edit
      this.data = data
      this.initData()
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
    handle(cb) {
      this.form.ref.validate(valid => {
        if (valid) {
          let postdata = this.maindata.getEditData(this.form.data, this.modlist, this.type)
          if (this.type == 'change') {
            cb(this.maindata.triggerMethod('changeItem', { postdata: postdata, targetitem: this.data }))
          } else {
            cb(this.maindata.triggerMethod('buildItem', { postdata: postdata }))
          }
        } else {
          cb(null)
        }
      })
    }
  }
}
</script>
