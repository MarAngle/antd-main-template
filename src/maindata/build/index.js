import { DefaultData } from '@/mainbuild/index'

let a = new DefaultData({
  name: 'a',
  prop: 'a'
}, {
  extra: {
    c: '3'
  }
})
console.log(a, a._selfName())

let f1 = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 2000)
  })
}
f1().then(res => {
  console.log(res)
  console.log(3)
  // return new Promise((resolve, reject) => {
  //   console.log(res)
  //   setTimeout(() => {
  //     resolve(2)
  //   }, 2000)
  // })
  // return 5
}).then(res => {
  console.log(res)
})
