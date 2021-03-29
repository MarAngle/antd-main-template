
const className = 'v-auto-local-line-menu'

const width = 100

function checkShow(el, height) {
  let menuDiv = el.getElementsByClassName(className)[0]
  if (el.dataset.lineCanShow === '1') {
    // 需要换行的时候进行
    menuDiv.display = 'block'
    el.style.paddingRight = width + 'px'
    if (el.dataset.lineIsShow === '0') {
      el.style.height = 'auto'
    } else {
      el.style.height = height + 'px'
    }
  } else {
    menuDiv.display = 'none'
    el.style.paddingRight = 0 + 'px'
    el.style.height = 'auto'
  }
}

function initLineMenu(el, height) {
  el.style.overflow = 'hidden'
  el.style.position = 'relation'
  let menuDiv = document.createElement('div')
  menuDiv.classList.add(className)
  menuDiv.style.display = 'none'
  menuDiv.style.height = height + 'px'
  menuDiv.style.width = width + 'px'
  menuDiv.style.top = 0 + 'px'
  menuDiv.style.right = 0 + 'px'
  menuDiv.innerHTML = `<span>up</span>`
  el.dataset.lineIsShow = '0'
  menuDiv.onclick = function() {
    el.dataset.lineIsShow = el.dataset.lineIsShow === '0' ? '1' : '0'
    checkShow(el, height)
  }
  el.appendChild(menuDiv)
  return menuDiv
}

const data = {
  name: 'line',
  data: {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
    bind: function (el, { name, value }) {
      initLineMenu(el, value)
    },
    componentUpdated: function (el, { name, value }) {
      if (el.offsetHeight > value) {
        el.dataset.lineCanShow = '1'
      } else {
        el.dataset.lineCanShow = '0'
      }
      checkShow(el, value)
    },
    unbind: function (el, { name, value }) {
      console.log('unbind', el, { name, value })
    }
  }
}

export default data
