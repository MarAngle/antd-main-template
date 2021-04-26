
import utils from './../data/utils'

let o1 = {
  a: 'a',
  o: {
    b: '2',
    c: '3',
    o: {
      b: '2',
      c: '3',
      d: [1, {
        a: 1
      }]
    }
  }
}

let d1 = utils.deepClone(o1, true)

console.log(d1, o1)
