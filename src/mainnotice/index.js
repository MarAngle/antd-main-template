import { Modal, notification } from 'ant-design-vue'

let notice = {}

notice.showmsg = function (content, type = 'open', title = '通知', duration = 3) {
  this.setmsg({
    message: title,
    description: content,
    duration: duration
  }, type)
}

notice.setmsg = function (option, type = 'open') {
  if (notification[type]) {
    notification[type](option)
  } else {
    console.error('notification type is not defined, type reset open')
    notification.open(option)
  }
}

notice.alert = function (content, title, next, type = 'error', okText = '确认') {
  this.setmodal({
    title: title,
    content: content,
    okText: okText,
    onOk: function () {
      if (next) {
        next('ok')
      }
    }
  }, type)
}

notice.confirm = function (content, title, next, okText = '确认', cancelText = '取消') {
  this.setmodal({
    title: title,
    content: content,
    okText: okText,
    cancelText: cancelText,
    onCancel: function () {
      if (next) {
        next('cancel')
      }
    },
    onOk: function () {
      if (next) {
        next('ok')
      }
    }
  }, 'confirm')
}

notice.setmodal = function (option, type = 'info') {
  if (Modal[type]) {
    Modal[type](option)
  } else {
    console.error('modal type is not defined, type reset info')
    Modal.info(option)
  }
}

export default notice
