import _func from 'complex-func'

_func.setWorker({
  func: function(list) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ a: 1 })
      }, 2000)
    })
  },
  args: [[1, 23]],
  isSync: true,
  log: true
}).then(
  res => { console.log(res) },
  err => { console.log(err) }
)

let pf = function(a, b, c) {
  return new Promise((resolve, reject) => {
    console.log(a, b, c)
    reject({ name: a })
  })
  // return a
}

_func.triggerPromise({
  func: pf,
  args: [1, '3', 5],
  error: (code) => {
    console.log(code)
  },
  start: () => {
    console.log('start')
  },
  success: (res) => {
    console.log('success', res)
  },
  fail: (res) => {
    console.log('fail', res)
  }
})

_func.runFunction(pf, [1, '3'], function(res) {
  console.log(res)
})

// function Car() {
//   this.name = 'Car'
// }

// Car.prototype.speed = 10

// let car = new Car()
// console.log(car)
// for (let n in car) {
//   console.log(n)
// }
// console.log(Object.keys(car))
