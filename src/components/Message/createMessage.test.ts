import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'
import { closeAll, createMessage } from './method'

export const rAF = async () => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        resolve(null)
        await nextTick()
      })
    })
  })
}
function getTopValue(element: Element) {
  // getBoundingClientRect: 此api在test环境中获取到的数值都是0
  // 因为test环境下，对dom的测试是在jsdom下模拟出来的，jsdom对getBoundingClientRect有bug
  // https://github.com/jsdom/jsdom/issues/1590
  const styles = window.getComputedStyle(element)
  const topValue = styles.getPropertyValue('top')
  return Number.parseFloat(topValue)
}

// npx vitest createMessage

describe('createMessage', () => {
  test('调用方法应该创建对应的 Message 组件', async () => {
    const instance = createMessage({ message: 'hello world', duration: 0 })
    await rAF()
    console.log('html', document.body.innerHTML)
    expect(document.querySelector('.vk-message')).toBeTruthy()
    instance.destory()
    await rAF()
    console.log('html2', document.body.innerHTML)
    expect(document.querySelector('.vk-message')).toBeFalsy()
  })
  test('多次调用方法应该创建多个实例', async () => {
    createMessage({ message: 'hello world', duration: 0 })
    createMessage({ message: 'hello world 2', duration: 0 })
    await rAF()
    const elements = document.querySelectorAll('.vk-message')
    expect(elements.length).toBe(2)
    closeAll()
    await rAF()
    expect(document.querySelector('.vk-message')).toBeFalsy()
  })
  test('创建多个实例应该设置正确的 offset', async () => {
    createMessage({ message: 'hello world', duration: 0, offset: 100 })
    createMessage({ message: 'hello world 2', duration: 0, offset: 50 })
    await rAF()
    const elements = document.querySelectorAll('.vk-message')
    expect(elements.length).toBe(2)
    const firstElementTop = getTopValue(elements[0])
    const secondElementTop = getTopValue(elements[1])

    // console.log(firstElementTop, secondElementTop)
    expect(firstElementTop).toBe(100)
    expect(secondElementTop).toBe(150)
  })
})
