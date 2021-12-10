// 组件
import 'complex-component-antd'
// 功能插件
import './func/index'
// 实现类
import { antdOption } from 'complex-data'
// 新版本组件
import './../MainPlugin/complex-component-antd-next/index'
import newAntOption from './../MainPlugin/complex-data-next/option/antd/index'
newAntOption.init()

// 实现类antd-option加载
antdOption.init()
