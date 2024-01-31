import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Icon from '../Icon/Icon.vue'
import Button from './Button.vue'

// npx vitest Button

describe('Button.vue', () => {
  test('basic button', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
      },
      slots: {
        default: 'button',
      },
    })
    
    console.log(wrapper.html())
    
    // console.log(wrapper.classes()) // [ 'vk-button', 'vk-button--primary' ]
    expect(wrapper.classes()).toContain('vk-button--primary')
    // slot
    // get: 如果找不到元素，会抛出错误, find：找不到元素，不会抛出错误，继续往下执行
    // text(): 返回文本
    // html():
    // console.log(wrapper.get('button').text()) // button
    expect(wrapper.get('button').text()).toBe('button')

    // 判断事件是否被触发
    wrapper.get('button').trigger('click')
    // console.log(wrapper.emitted()) // { click: [ [ [MouseEvent] ] ] }, 输出执行的事件对应名称
    expect(wrapper.emitted()).toHaveProperty('click') // toHaveProperty: 是否有这个属性
  })

  test('disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'disabled'
      }
    })

    console.log(wrapper.html())

    // attributes
    expect(wrapper.attributes('disabled')).toBeDefined() // toBeDefined: 判断属性是否存在

    // attributes
    // console.log(wrapper.find('button').element) // HTMLButtonElement, .element: 拿到真正的DOM节点
    // console.log(wrapper.find('button').element.disabled) // true
    expect(wrapper.find('button').element.disabled).toBeDefined()
    
    wrapper.get('button').trigger('click')
    // console.log(wrapper.emitted()) // {}
    expect(wrapper.emitted()).not.toHaveProperty('click')
  })

  test('icon', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow-up'
      },
      slots: {
        default: 'icon'
      },
      global: {
        stubs: ['FontAwesomeIcon'] // 填写组件名称，模拟组件
      }
    })

    console.log(wrapper.html())

    const iconElement = wrapper.findComponent(FontAwesomeIcon) // findComponent: 找组件
    
    // console.log(iconElement.exists()) // true
    expect(iconElement.exists()).toBeTruthy() // 判断组件是否存在
    // console.log(iconElement.attributes('icon')) // arrow-up
    expect(iconElement.attributes('icon')).toBe('arrow-up')
  })

  test('loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'loading'
      },
      global: {
        stubs: ['Icon'] // 传入二次封装的组件
      }
    })

    console.log(wrapper.html())

    const iconElement = wrapper.findComponent(Icon)
    expect(iconElement.exists()).toBeTruthy()
    expect(iconElement.attributes('icon')).toBe('spinner')
    expect(wrapper.attributes('disabled')).toBeDefined() // toBeDefined: 判断属性是否存在
  })
})
