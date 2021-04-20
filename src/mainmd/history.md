----
## 2021/04/19 version 3.1
### 实现类
- 全局
  =>代码优化，结构调整
  =>使用rest参数扩展传参
  =>优化函数名
  =>添加模块加载/卸载相关
  =>

- InstrcutionData
  =>说明类的实现

- EmptyData
  =>空数据对象

- SimpleData
  =>数据结构依赖从SimpleData开始，所有类的基础，方便扩展全局方法
  =>扩展模块加载/卸载相关方法

- DefaultData
  =>生命周期从此处开始
  =>扩展模块对象
  =>data的初始化赋值
  =>创建生命周期的实现

- SelectList
  =>优化扩展，实现多筛选条件
  =>设置删除深拷贝相关方法，需要的话在赋值前进行设置，获取列表和字段时不进行深拷贝相关设置

- ChoiceData
  =>实现选择类创建
  =>重置逻辑判断优化
  =>change回调优化

- LifeData
  =>生命周期函数扩展函数数据类
  =>实现排序
  =>实现once，immediate
  =>从预定义改为可扩展，替代部分事件总线类操作

- FuncData
  =>事件对象数据创建
  =>实现多回调的操作

- LayoutData
  =>布局对象数据创建

- PaginationData
  =>扩展设置项

- DictionaryList
  =>抽离组件，优化代码
  =>字典列表创建修改时触发生命周期
  =>使用Vue.set进行赋值操作
  =>modlist逻辑优化

- SearchData
  =>优化代码结构，优化扩展性

- ListData
  =>ChoiceData模块抽离
  =>reloadData函数优化

- TreeData
  =>继承于ListData
### 组件
- 通过JSX重构ant-d相关组件

- FileView
  =>数组重复赋值问题修复

- PaginationView
  =>添加更多插槽

- AutoText的实现

- AutoMenu的实现