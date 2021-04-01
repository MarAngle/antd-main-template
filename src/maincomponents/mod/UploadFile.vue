<style lang="less" scoped>
.UploadFile{
  *{
    box-sizing: border-box;
  }
  width: 100%;
  .UploadFileDataArea{
    border-radius: 1px;
    line-height: 28px;
    height: 28px;
    padding: 3px 5px 3px 5px;
    .delete{
      visibility: hidden;
    }
    &:hover{
      background-color: #eee;
      .delete{
        visibility: visible;
      }
    }
  }
  &.bottom{
    display: inline-block;
    .UploadFileMenu{
      display: block;
    }
    .UploadFileData{
      width: 100%;
      margin-top: 10px;
      display: block;
      .UploadFileDataArea{
        display: block;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        >span{
          flex: auto;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        >.delete{
          margin-left: 10px;
          flex: none;
        }
      }
    }
  }
  &.end, &.start{
    .UploadFileMenu{
      display: inline;
    }
    .delete{
      margin-left: 10px;
    }
  }
  &.end{
    .UploadFileData{
      .UploadFileDataArea{
        margin-left: 10px;
      }
    }
  }
  &.start{
    .UploadFileData{
      .UploadFileDataArea{
        margin-right: 10px;
      }
    }
  }
}
</style>
<template>
  <span class="UploadFile" :class="layout">
    <InputFile
      style="display: none"
      ref="inputfile"
      :accept="accept"
      :multiple="multiple"
      :multipleAppend="multipleAppend"
      :maxNum="maxNum"
      :minNum="minNum"
      :maxSize="maxSize"
      @change="onChange"
    />
    <span class="UploadFileData" v-if="layout == 'start'">
      <template v-if="!multiple && file.name">
        <span class="UploadFileDataArea">
          <span>{{ file.name }}</span>
          <a-icon class="delete" type="delete" @click="onDelete()" ></a-icon>
        </span>
      </template>
      <template v-else-if="multiple && file.list.length > 0">
        <span class="UploadFileDataArea" v-for="(val, index) in file.list" :key="index">
          <span>{{ val.name }}</span>
          <a-icon class="delete" type="delete" @click="onDelete(index, val)" ></a-icon>
        </span>
      </template>
    </span>
    <span class="UploadFileMenu" @click="onOpen">
      <slot>
        <a-button :loading="loading" :disabled="disabled" icon="upload" >{{ placeholder }}</a-button>
      </slot>
    </span>
    <span class="UploadFileData" v-if="layout != 'start'">
      <template v-if="!multiple && file.name">
        <span class="UploadFileDataArea">
          <span>{{ file.name }}</span>
          <a-icon class="delete" type="delete" @click="onDelete" ></a-icon>
        </span>
      </template>
      <template v-else-if="multiple && file.list.length > 0">
        <span class="UploadFileDataArea" v-for="(val, index) in file.list" :key="index">
          <span>{{ val.name }}</span>
          <a-icon class="delete" type="delete" @click="onDelete(index, val)" ></a-icon>
        </span>
      </template>
    </span>
  </span>
</template>

<script>
import InputFile from './InputFile'

export default {
  name: 'UploadFile',
  components: {
    InputFile
  },
  data () {
    return {
      file: {
        data: this.multiple ? [] : undefined,
        name: '',
        url: '',
        list: []
      },
      loading: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(data) {
        this.setData(data, 'value')
      }
    }
  },
  props: {
    value: {
      type: [String, Number, File, Object, Array]
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    accept: {
      type: String,
      required: false,
      default: ''
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    multipleAppend: {
      type: Boolean,
      required: false,
      default: false
    },
    maxNum: {
      type: [Number],
      required: false,
      default: 0
    },
    minNum: {
      type: [Number],
      required: false,
      default: 0
    },
    maxSize: { // MB
      type: Number,
      required: false,
      default: 0
    },
    upload: {
      type: Boolean,
      required: false,
      default: false
    },
    fileUpload: { // MB
      type: [Function, Boolean],
      required: false,
      default: false
    },
    layout: {
      type: String,
      required: false,
      default: 'bottom'
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    }
  },
  mounted() {
  },
  methods: {
    emitData() {
      let data = this.file.data
      this.$emit('input', data)
      this.$emit('change', data)
    },
    onOpen() {
      this.$refs['inputfile'].$el.click()
    },
    onDelete(index, item) {
      if (!this.multiple) {
        this.clearData()
        this.emitData()
      } else {
        this.file.data.splice(index, 1)
        this.file.list.splice(index, 1)
        this.emitData()
      }
    },
    onLoading(data) {
      this.loading = data
      this.$emit('loading', this.loading)
    },
    onChange(file) {
      if (!this.upload) {
        this.setData(file, 'origin')
      } else {
        if (this.fileUpload) {
          this.onLoading(true)
          this.fileUpload({ file }).then(res => {
            this.onLoading(false)
            this.setData(res, 'origin')
          }, res => {
            this.onLoading(false)
            this.clearData()
            this.emitData()
          })
        } else {
          this._func.showmsg('未定义上传文件函数，请检查代码!', 'error')
        }
      }
    },
    setData(data, from, unemit) {
      if (!this.multiple) {
        // 单文件模式
        if (this.file.data === data) {
          // 当前数据与传递数据一致
          if (from == 'value') {
            unemit = true
          }
        } else if (data) {
          // 数据不一致切存在值时进行赋值操作
          this.buildFileData(this.file, data)
        } else {
          // 数据不一致，传值为空时进行clear操作
          // 理论上存在一个值=>非und与当前值为und时会出发到此处，进行上传操作避免问题
          this.clearData()
        }
      } else {
        // 多选模式
        let isEmpty = false
        // 传值为空或者为空数组时判断为空数据
        if (!data) {
          isEmpty = true
        } else if (this._func.isArray(data) && data.length == 0) {
          isEmpty = true
        }
        if (isEmpty) {
          // 当前数据为空数据时
          this.clearData(data)
        } else if (this.file.data === data) {
          // 当前数据与传递数据一致
          if (from == 'value') {
            unemit = true
          }
        } else {
          if (!this.checkFileList(data)) {

          }
        }
      }
      if (!unemit) {
        this.emitData()
      }
    },
    buildFileData(targetdata, origindata) {
      let type = this._func.getType(origindata)
      if (type == 'file') {
        targetdata.name = origindata.name
        targetdata.data = origindata
        targetdata.url = ''
      } else if (type == 'object') {
        targetdata.data = origindata.data
        targetdata.name = origindata.name
        targetdata.url = origindata.url
      } else {
        targetdata.data = origindata
        targetdata.name = origindata
        targetdata.url = ''
      }
    },
    clearData(data) {
      this.file.name = ''
      this.file.url = ''
      if (!this.multiple) {
        if (this.file.data !== undefined) {
          this.file.data = undefined
        }
      } else {
        data = data || []
        this.file.data = data
      }
      this.file.list = []
    },
    // 检查文件列表
    checkFileList(data) {
      if (!this._func.isArray(data)) {
        data = []
      }
      if (!this._func.isArray(this.file.data)) {
        this.file.data = []
      }
      if (this.file.data === data) {
        return true
      } else {
        // 添加不同新数据
        for (let n = 0; n < data.length; n++) {
          let oitem = data[n]
          let item = {}
          this.buildDataItem(item, oitem)
          data.splice(n, 1, item)
        }
        for (let n = 0; n < this.file.list.length; n++) {
          let targetitem = this.file.list[n]
          for (let i = 0; i < data.length; i++) {
            let originitem = data[i]
            // 删除相同子数据
            if (targetitem.data == originitem.data) {
              data.splice(i, 1)
              i--
              break
            }
          }
        }
        if (data.length == 0) {
          return true
        } else {
          return false
        }
      }
    },
  }
}
</script>
