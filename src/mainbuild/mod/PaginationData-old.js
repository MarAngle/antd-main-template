import _func from '@/maindata/func/index'

let defaultdata = {
  size: {
    current: 8,
    list: ['8', '20', '50', '100']
  }
}

class PaginationData {
  constructor (initdata) {
    this.size = {
      current: 10,
      list: []
    }
    this.page = {
      current: 1,
      total: 1
    }
    this.data = {
      total: 0
    }
    this.mod = {
      total: {
        show: true,
        align: 'left',
        func: (pagenum, num) => {
          return `共${pagenum}页 ${num}条`
        }
      },
      size: {
        show: true
      },
      jump: {
        show: true
      }
    }
    this._initMain(initdata)
  }
  _initMain ({ size, mod }) {
    this._initSize(size)
    this._initMod(mod)
  }
  // 加载size和列表
  _initSize (size) {
    if (!size) {
      this.size.current = defaultdata.size.current
      this.size.list = _func.deepClone(defaultdata.size.list)
    } else {
      let sizetype = _func.getType(size)
      if (sizetype != 'object') {
        this.size.current = Number(size)
        this.size.list = [this.size.current.toString()]
      } else {
        this.size.current = Number(size.current)
        if (!this.size.list) {
          this.size.list = [this.size.current.toString()]
        } else {
          this.size.list = size.list
        }
      }
    }
  }
  // 记载设置项
  _initMod (mod) {
    if (mod) {
      // 总数显示设置
      if (mod.total) {
        if (mod.total == 'hidden') {
          this.mod.total.show = false
        } else {
          this.mod.total.show = mod.total.show
          if (mod.total.align) {
            this.mod.total.align = mod.total.align
          }
          if (mod.total.func) {
            this.mod.total.func = mod.total.func
          }
        }
      }
      // size显示设置
      if (mod.sizehidden) {
        this.mod.size.show = false
      } else if (mod.size) {
        this.mod.size = mod.size
      }
      // jump显示设置
      if (mod.jumphidden) {
        this.mod.jump.show = false
      } else if (mod.jump) {
        this.mod.jump = mod.jump
      }
    }
  }
  // 设置总条数
  setTotal (num) {
    this.data.total = num
    this.countTotalPage()
  }
  // 获取总数
  getTotal () {
    return this.data.total
  }
  // 计算总页码
  countTotalPage () {
    this.page.total = _func.getNum(this.data.total / this.size.current, 'ceil', 0)
  }
  // 设置当前页
  setPage (current) {
    this.page.current = current
  }
  // 获取总页码
  getTotalPage () {
    return this.page.total
  }
  // 更改页面条数
  setSize ({ page, size }) {
    this.setPage(page)
    this.size.current = size
    this.countTotalPage()
  }
  // 获取当前页
  getPage () {
    return this.page.current
  }
  // 获取当前size
  getSize () {
    return this.size.current
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
  _selfName () {
    return `[${this.constructor.name}]`
  }
}

export default PaginationData
