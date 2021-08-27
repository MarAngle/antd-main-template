let page = {
  type: 'default', // default / main
  recount: {
    main: 0,
    resize: 0,
    sider: 0
  },
  mod: {
    body: {
      width: 0,
      height: 0
    },
    sider: {
      show: true,
      type: 'default', // default / mini
      width: 256,
      data: {
        default: 256,
        mini: 80
      }
    },
    header: {
      show: true,
      height: 64
    },
    extra: {
      width: 0,
      height: 0
    },
    main: {
      width: 0,
      height: 0
    }
  },
  data: {
    menu: {
      data: []
    }
  }
}

page.upCount = function(prop) {
  if (prop) {
    this.recount[prop]++
  }
  this.recount.main++
}

page.initBodyPage = function () {
  this.mod.body.width = document.documentElement.clientWidth
  this.mod.body.height = document.documentElement.clientHeight
  this.reCountPage()
  this.upCount('resize')
}

page.setMenuData = function (data) {
  this.data.menu.data = data
}

page.setType = function (type) {
  this.type = type
}

page.toggleSiderType = function () {
  if (this.mod.sider.type == 'default') {
    this.setSiderType('mini')
  } else {
    this.setSiderType('default')
  }
}

page.setSiderType = function (type) {
  this.mod.sider.type = type
  this.mod.sider.width = this.mod.sider.data[type]
  this.reCountPage()
  this.upCount('size')
}

page.reCountExtra = function () {
  let width = 0
  let height = 0
  if (this.mod.sider.show) {
    width += this.mod.sider.width
  }
  if (this.mod.header.show) {
    height += this.mod.header.height
  }
  this.mod.extra.width = width + 0
  this.mod.extra.height = height + 0
}
page.reCountPage = function (uncountExtra) {
  if (!uncountExtra) {
    this.reCountExtra()
  }
  this.mod.main.width = this.mod.body.width - this.mod.extra.width
  this.mod.main.height = this.mod.body.height - this.mod.extra.height
}

export default page
