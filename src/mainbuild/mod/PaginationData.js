import _func from '@/maindata/func/index'

let defaultdata = {
  size: {
    current: 8,
    list: ['8', '20', '50', '100']
  }
}

class PaginationData {
  constructor (initdata) {
    this.status = {
      init: false
    }
    this.data = {
      page: {
        current: 1,
        total: 1
      },
      size: {
        current: 8,
        list: []
      },
      num: {
        total: 1
      }
    }
    this.option = {
      props: {}
    }
    this._initMain(initdata)
  }
  _initMain (initdata) {
    if (initdata) {
      if (initdata === true) {
        initdata = {}
      }
      this.status.init = true
      this.initSize(initdata.size)
      this.initOption(initdata.props, initdata.option)
    }
  }
  initSize(size) {
    if (!size) {
      this.data.size.current = defaultdata.size.current
      this.data.size.list = _func.deepClone(defaultdata.size.list)
    } else {
      let sizeType = _func.getType(size)
      if (sizeType != 'object') {
        this.data.size.current = Number(size)
        this.data.size.list = [this.data.size.current.toString()]
      } else {
        this.data.size.current = Number(size.current)
        if (!this.data.size.list) {
          this.data.size.list = [this.data.size.current.toString()]
        } else {
          this.data.size.list = size.list
        }
      }
    }
  }
  initOption(props = {}, option = {}) {
    if (!option.props) {
      option.props = {}
    }
    option.props = {
      showQuickJumper: props.jumper === undefined ? true : props.jumper,
      showSizeChanger: props.size === undefined ? true : props.size
    }
    this.option = {
      ...option
    }
  }
  getOption() {
    return this.option
  }
}

export default PaginationData
