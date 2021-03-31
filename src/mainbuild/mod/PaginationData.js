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
    this.initMain(initdata)
  }
  initMain (initdata) {
    if (initdata) {
      if (initdata === true) {
        initdata = {}
      }
      this.setInit(true)
      this.initSize(initdata.size)
      this.initOption(initdata.props, initdata.option)
    }
  }
  isInit() {
    return this.status.init
  }
  setInit(init) {
    this.status.init = init
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
  // 计算总页码
  countTotalPage () {
    this.data.page.total = _func.getNum(this.data.num.total / this.data.size.current, 'ceil', 0)
  }
  setTotal(num) {
    this.data.num.total = num
    this.countTotalPage()
  }
  // 设置当前页
  setPage (current) {
    this.data.page.current = current
  }
  // 获取总页码
  getTotalPage () {
    return this.data.page.total
  }
  // 更改页面条数
  setSize ({ page, size }) {
    this.setPage(page)
    this.data.size.current = size
    this.countTotalPage()
  }
  // 获取当前页
  getPage () {
    return this.data.page.current
  }
  // 获取当前size
  getSize () {
    return this.data.size.current
  }
  // 获取当前数据
  getCurrent () {
    return {
      page: this.getPage(),
      size: this.getSize()
    }
  }
  // 重置
  reset () {
    this.setTotal(0)
    this.setPage(1)
  }
  install(target) {
    let dict = [
      {
        prop: 'isPaginationInit',
        originProp: 'isInit'
      },
      {
        prop: 'getPageData',
        func: (prop) => {
          let res
          if (this.isInit()) {
            if (prop == 'page') {
              res = this.getPage()
            } else if (prop == 'size') {
              res = this.getSize()
            } else if (prop == 'num') {
              res = this.getTotal()
            } else {
              res = this.getCurrent()
            }
          }
          return res
        }
      },
      {
        prop: 'setPageData',
        func: (data, prop = 'page') => {
          if (this.isInit()) {
            if (prop == 'page') {
              this.setPage(data)
            } else if (prop == 'size') {
              this.setSize(data) // { page, size }
            } else if (prop == 'num') {
              this.setTotal(data)
            }
          }
        }
      }
    ]
    for (let n = 0; n < dict.length; n++) {
      let dictData = dict[n]
      if (!target[dictData.prop]) {
        if (dictData.func) {
          target[dictData.prop] = (...args) => {
            return dictData.func(...args)
          }
        } else {
          target[dictData.prop] = (...args) => {
            return this[dictData.originProp](...args)
          }
        }
      } else {
        target._printInfo(`存在${dictData.prop}方法,${this._selfName()}install=>${dictData.originProp}失败`)
      }
    }
    target.setLifeData({
      type: 'reseted',
      func: () => {
        this.reset()
      }
    })
  }
}

export default PaginationData
