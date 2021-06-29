import _func from 'complex-func'

// _func.setWorker({
//   func: function(list) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ a: 1 })
//       }, 2000)
//     })
//   },
//   args: [[1, 23]],
//   isSync: true,
//   log: true
// }).then(
//   res => { console.log(res) },
//   err => { console.log(err) }
// )

// let pf = function(a, b, c) {
//   return new Promise((resolve, reject) => {
//     console.log(a, b, c)
//     reject({ name: a })
//   })
//   // return a
// }

// _func.triggerPromise({
//   func: pf,
//   args: [1, '3', 5],
//   error: (code) => {
//     console.log(code)
//   },
//   start: () => {
//     console.log('start')
//   },
//   success: (res) => {
//     console.log('success', res)
//   },
//   fail: (res) => {
//     console.log('fail', res)
//   }
// })

// _func.runFunction(pf, [1, '3'], function(res) {
//   console.log(res)
// })
// clone相关
let obj = {
  a: 1,
  b: [1, 2, 3],
  c: {
    h: 20
  },
  d: () => {}
}

obj.b.push(obj.c)
obj.c.j = obj.b

let obj2 = {
  aaa: '1111',
  c: {
    h: '12'
  }
}
console.log(_func.updateData(obj, obj2, {
  type: 'add',
  limit: {
    // list: ['c']
  }
}))
// clone相关
// updateList相关
let list = [
  {
    id: '1',
    name: 'a'
  },
  {
    id: '2',
    name: 'b'
  }
]

let list2 = [
  {
    id: '1',
    name: 'c'
  }
]

_func.updateList(list2, list, {
  check: 'id'
})

console.log(list2, list)

// updateList相关
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
