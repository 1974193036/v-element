import { beforeEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'

vi.mock('@popperjs/core') // 模拟createPopper，使得wrapper.html()上没有因createPopper造成的任何样式，提升测试性能
const onVisibleChange = vi.fn()

// npx vitest Tooltip

describe('Tooltip.vue', () => {
  // vitest钩子函数
  // beforeEach: 在每个用例开始之前都会做处理
  beforeEach(() => {
    // 注意定时器的影响
    vi.useFakeTimers() // 设定一个假的timer
  })
  test('basic tooltip', async () => {
    const wrapper = mount(() =>
    <div>
      <div id="outside"></div>
      <Tooltip content="hello tooltip" trigger='click' onVisible-change={onVisibleChange}>
        <button id="trigger">Trigger</button>
      </Tooltip>
    </div>
    , {
      attachTo: document.body,
    })
    // 静态测试
    const triggerArea = wrapper.find('#trigger')
    expect(triggerArea.exists()).toBeTruthy()
    expect(wrapper.find('.vk-tooltip__popper').exists()).toBeFalsy()
    console.log('before', wrapper.html())
    // 测试点击行为
    triggerArea.trigger('click')
    await vi.runAllTimers() // 把对应的定时器走完
    expect(wrapper.find('.vk-tooltip__popper').exists()).toBeTruthy()
    expect(wrapper.get('.vk-tooltip__popper').text()).toBe('hello tooltip')
    expect(onVisibleChange).toHaveBeenCalledWith(true) // 事件被调用，且参数是true
    console.log('after', wrapper.html())
    wrapper.get('#outside').trigger('click')
    await vi.runAllTimers()
    expect(wrapper.find('.vk-tooltip__popper').exists()).toBeFalsy()
    expect(onVisibleChange).toHaveBeenLastCalledWith(false)
  })
})
