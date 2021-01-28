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
