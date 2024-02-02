import { h, render, shallowReactive } from 'vue'
import useZIndex from '../../hooks/useZIndex'
import type { CreateMessageProps, MessageContext } from './types'
import MessageConstructor from './Message.vue'

let seed = 1

// 定义成一个响应式对象
// 使得instances改变的时候，计算属性callback重新执行，即 getLastBottomOffset 会重新执行，重新计算定位
const instances: MessageContext[] = shallowReactive([])

export const createMessage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex()
  const id = `message_${seed++}`

  // 手动调用删除，其实就是手动的调整组件中 visible 的值
  // visible 是通过 expose 传出来的
  const manualDestroy = () => {
    const instance = instances.find(instance => instance.id === id)
    if (instance)
      instance.vm.exposed!.visible.value = false
  }

  const container = document.createElement('div')

  const destory = () => {
    // 删除数组中的实例
    const idx = instances.findIndex(instance => instance.id === id)
    if (idx === -1) return
    // 定义成一个响应式对象，当销毁其中一个组件时，让instances改变，计算属性callback重新执行，即 getLastBottomOffset 会重新执行，重新计算定位
    instances.splice(idx, 1)
    // 销毁dom
    render(null, container)
  }

  const newProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestory: destory,
  }
  const vnode = h(MessageConstructor, newProps)
  render(vnode, container)
  // 非空断言操作符
  document.body.appendChild(container.firstElementChild!)

  const vm = vnode.component!
  const instance = {
    id,
    vnode,
    vm,
    props: newProps,
    destory: manualDestroy,
  }
  instances.push(instance)
  return instance
}

export const getLastInstance = () => {
  return instances.at(-1)
}

export const getLastBottomOffset = (id: string) => {
  const idx = instances.findIndex(instance => instance.id === id)
  console.log('idx', id, idx, instances.length)
  if (idx <= 0) {
    return 0
  }
  else {
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
}

export const closeAll = () => {
  instances.forEach((instance) => {
    instance.destory()
  })
}
