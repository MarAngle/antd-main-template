
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

// let d1 = utils.deepClone(o1, true)

// console.log(d1 === o1, d1.o === o1.o, d1.o.b === o1.o.b, d1.o.o.d[1] === o1.o.o.d[1])

let d2 = {
  d: 2,
  name: '1',
  data: {
    c: 3,
    d: {
      d: 1
    }
  }
}

let o2 = {
  o: 2,
  name: '2',
  data: {
    a: 1,
    b: 2,
    d: {
      d: 'new'
    }
  }
}

d2 = utils.updateData(d2, o2, {
  type: 'total'
})

console.log(d2)
