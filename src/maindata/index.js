import Vue from 'vue'
// 全局组件
import '@/maincomponents/index'
// 实现类
import './build/index'
// 功能插件
import _func from './func/index'
Vue.prototype._func = _func
