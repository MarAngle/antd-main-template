### 需要修改的文件列表
1. 安装complex-func/complex-data/complex-component-antd
2. 创建maindata文件夹，引用相关插件和设置项
3. main.js
    import './maindata/index'
  调用插件
4. 修改.eslintrc.js
5. 对接页面布局信息，其中sider加载时触发页面一次
  \src\layouts\BasicLayout.vue mounted时触发this._func.page.upCount('sider')函数
  \src\store\modules\app.js
    import _func from 'complex-func'
    _func.page.setSiderType(type ? 'mini' : 'default')
6. 路由添加
  \src\router\generator-routers.js 引用模板
  \src\mock\services\user.js 设置路由
7. 迁移mainpage
8. 迁移MainPlugin
9. 注释输出
  \src\core\bootstrap.js
10. 懒加载antd组件
  FormModel
  Pagination
11. 对接接口/登录/权限
12. 对接git