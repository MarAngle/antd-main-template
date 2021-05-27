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
