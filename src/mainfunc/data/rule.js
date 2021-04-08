
let config = {
  num: '0-9',
  smallLetter: 'a-z',
  bigLetter: 'A-Z',
  text: '\u4e00-\u9fa5'
}

let rule = {
  data: {
    mobile: {
      method: 'reg',
      data: /^((\+?86)|(\(\+86\)))?1\d{10}$/
    },
    // 数字，包括小数+-
    num: {
      method: 'reg',
      data: /^(-|\+)?\d+(\.\d+)?$/
    },
    // 整数+-
    integerNum: {
      method: 'reg',
      data: /^(-|\+)?\d+$/
    },
    // 英文字母
    letter: {
      method: 'reg',
      data: /^[a-zA-Z]+$/
    },
    // 英文字母加整数
    letterNum: {
      method: 'reg',
      data: /^[0-9a-zA-Z]*$/
    },
    text: {
      method: 'reg',
      data: /^[\u4e00-\u9fa5]{0,}$/
    }
  }
}

export default rule
