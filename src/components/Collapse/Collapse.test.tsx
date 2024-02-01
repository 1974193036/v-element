import { beforeAll, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'
const onChange = vi.fn()
let wrapper: VueWrapper
let headers: DOMWrapper<Element>[], contents: DOMWrapper<Element>[]
let firstContent: DOMWrapper<Element>, secondContent: DOMWrapper<Element>, disabledContent: DOMWrapper<Element>,
  firstHeader: DOMWrapper<Element>, secondHeader: DOMWrapper<Element>, disabledHeader: DOMWrapper<Element>

// npx vitest Collapse

describe('Collapse.vue', () => {
  // vitest钩子函数
  // beforeAll: 在所有的用例开始之前都会触发，使得这个测试用例只初始化一次组件，而不必在每个测试用例中都进行mount
  beforeAll(() => {
    wrapper = mount(() =>
      <Collapse modelValue={['a']} onChange={onChange}>
        <CollapseItem name="a" title="title a">
          content a
        </CollapseItem>
        <CollapseItem name="b" title="title b">
          content b
        </CollapseItem>
        <CollapseItem name="c" title="title c" disabled>
          content c
        </CollapseItem>
      </Collapse>
    , {
      global: {
        stubs: ['Icon'], // 传入二次封装的组件
      },
      attachTo: document.body, // 解决一个bug: await点击事件后，dom未更新完成
    })
    console.log(wrapper.html())
    headers = wrapper.findAll('.vk-collapse-item__header')
    contents = wrapper.findAll('.vk-collapse-item__wrapper')
    firstHeader = headers[0]
    secondHeader = headers[1]
    disabledHeader = headers[2]
    firstContent = contents[0]
    secondContent = contents[1]
    disabledContent = contents[2]
  })

  test('测试基础结构以及对应文本', () => {
    // 长度
    expect(headers.length).toBe(3)
    expect(contents.length).toBe(3)
    // 文本
    expect(firstHeader.text()).toBe('title a')
    // 内容
    expect(firstContent.isVisible()).toBeTruthy()
    expect(secondContent.isVisible()).toBeFalsy()
    expect(firstContent.text()).toBe('content a')
  })

  test('点击标题展开/关闭内容', async () => {
    // 行为
    await firstHeader.trigger('click')
    expect(firstContent.isVisible()).toBeFalsy()
    await secondHeader.trigger('click')
    expect(secondContent.isVisible()).toBeTruthy()
  })

  test('发送正确的事件', () => {
    expect(onChange).toHaveBeenCalledTimes(2) // 调用了2次
    expect(onChange).toHaveBeenCalledWith([])
    expect(onChange).toHaveBeenLastCalledWith(['b']) // 最后一次调用，，且参数是['b']
  })

  // test.skip() // 跳过这个测试用例
  // test.only() // 只想运行当前这个测试用例
  test('disabled 的内容应该没有反应', async () => {
    onChange.mockClear() // 重置onChange的调用，因为上面调用了onChange
    expect(disabledHeader.classes()).toContain('is-disabled')
    await disabledHeader.trigger('click')
    expect(disabledContent.isVisible()).toBeFalsy()
    expect(onChange).not.toHaveBeenCalled() // 没有被调用
  })
})
