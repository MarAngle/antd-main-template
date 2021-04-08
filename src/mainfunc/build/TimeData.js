
let timeOption = {
  data: {
    year: {
      func: 'getFullYear',
      name: 'Y',
      min: 2,
      offset: 0
    },
    month: {
      func: 'getMonth',
      name: 'M',
      offset: 0
    },
    day: {
      func: 'getDate',
      name: 'D',
      offset: 0
    },
    hour: {
      func: 'getHours',
      name: 'H',
      offset: 0
    },
    min: {
      func: 'getMinutes',
      name: 'm',
      offset: 0
    },
    sec: {
      func: 'getSeconds',
      name: 's',
      offset: 0
    }
  }
}

class TimeData {
  constructor (data, format) {
    this.option = {
      format: ''
    }
    this.time = {}
    this.data = ''
    this.build(data, format)
  }
  build(data, format) {
    if (!format) {
      let time = new Date(data)
      for (let n in timeOption.data) {
        let timeItem = timeOption.data[n]
        this.time[n] = time[timeItem.func]() + timeItem.offset
      }
    } else {

    }
  }
  format() {

  }
  _selfName () {
    return `[${this.constructor.name}]`
  }
}
export default TimeData
