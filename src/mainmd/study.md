
# Vue
## 双向绑定
### 原理
#### 通过Proxy(Object.defineProperty)对属性值设置和获取的拦截实现
#### 访问数据时（obj.key)进行依赖收集，在 dep 中存储相关的 watcher
## watch
### 原理
#### 基于双向绑定在设置时进行回调
## computed
### 原理
#### 基于watch，在计算(获取时)对依赖值进行收集，收集到的值在修改时触发重新计算操作，缓存值
## nextTick
### 原理
#### Vue 的异步更新机制的核心是利用了浏览器的异步任务队列来实现的，首选微任务队列，宏任务队列次之。通过Promise进行异步微任务队列的创建，不存在Promise时调用MutationObserver实现异步微任务，再不存在则使用setImmediate(该方法用来把一些需要长时间运行的操作放在一个回调函数里，在浏览器完成后面的其他语句后，就立刻执行这个回调函数。),最后的办法时使用setTimeout，此时进行的是异步宏任务队列的创建
#### 当响应式数据更新后，会调用 dep.notify 方法，通知 dep 中收集的 watcher 去执行 update 方法，watcher.update 将 watcher 自己放入一个 watcher 队列（全局的 queue 数组）。
#### 然后通过 nextTick 方法将一个刷新 watcher 队列的方法（flushSchedulerQueue）放入一个全局的 callbacks 数组中。
#### 如果此时浏览器的异步任务队列中没有一个叫 flushCallbacks 的函数，则执行 timerFunc 函数，将 flushCallbacks 函数放入异步任务队列。如果异步任务队列中已经存在 flushCallbacks 函数，等待其执行完成以后再放入下一个 flushCallbacks 函数。

#### flushCallbacks 函数负责执行 callbacks 数组中的所有 flushSchedulerQueue 函数。
#### flushSchedulerQueue 函数负责刷新 watcher 队列，即执行 queue 数组中每一个 watcher 的 run 方法，从而进入更新阶段，比如执行组件更新函数或者执行用户 watch 的回调函数。
####  刷新队列，由 flushCallbacks 函数负责调用，主要做了如下两件事：
- 更新 flushing 为 ture，表示正在刷新队列，在此期间往队列中 push 新的 watcher 时需要特殊处理（将其放在队列的合适位置）
- 按照队列中的 watcher.id 从小到大排序，保证先创建的 watcher 先执行，也配合 第一步
- 遍历 watcher 队列，依次执行 watcher.before、watcher.run，并清除缓存的 watcher
#### 刷新队列之前先给队列排序（升序），可以保证：
- 组件的更新顺序为从父级到子级，因为父组件总是在子组件之前被创建
- 一个组件的用户 watcher 在其渲染 watcher 之前被执行，因为用户 watcher 先于 渲染 watcher 创建
- 如果一个组件在其父组件的 watcher 执行期间被销毁，则它的 watcher 可以被跳过
- 排序以后在刷新队列期间新进来的 watcher 也会按顺序放入队列的合适位置






