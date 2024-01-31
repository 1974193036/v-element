import type { Mocked } from 'vitest'
import { describe, expect, test, vi } from 'vitest'
import axios from 'axios'
import { request, testFn } from './utils'

vi.mock('axios') // 模拟一个axios
const mockedAxios = axios as Mocked<typeof axios>

// npx vitest example

// test('test common matcher', () => {
//   const name = 'viking'
//   expect(name).toBe('viking')
//   expect(2 + 2).toBe(4)
//   expect(2 + 2).not.toBe(5)
// })

// test('test to be true or false', () => {
//   expect(1).toBeTruthy()
//   expect(0).toBeFalsy()
// })

// test('test number', () => {
//   expect(4).toBeGreaterThan(3)
//   expect(2).toBeLessThan(3)
// })

// test('test object', () => {
//   expect({ name: 'viking', a: { b: 2 } }).toEqual({ name: 'viking', a: { b: 2 } })
// })

// callback test
describe('functions', () => {
  test('create a mock function', () => {
    const callback = vi.fn() // 模拟一个函数
    testFn(12, callback)
    expect(callback).toHaveBeenCalled() // 已经被调用了
    expect(callback).toHaveBeenCalledWith(12) // 已经被调用了，且参数是12
  })
  test('spy on method', () => {
    const obj = {
      getName: () => 1,
    }
    const spy = vi.spyOn(obj, 'getName') // 监控对象上的一个方法（监控obj上的getName这个方法）
    obj.getName()
    expect(spy).toHaveBeenCalled() // obj对象上的getName是否被调用了
    obj.getName()
    expect(spy).toHaveBeenCalledTimes(2) // 调用了2次
  })
  test('mock third party module', async () => {
    // mockedAxios.get.mockImplementation(() => Promise.resolve({ data: 123 })) // 模拟axios返回结果
    mockedAxios.get.mockResolvedValue({ data: 123 }) // 简写
    const result = await request()
    expect(result).toBe(123)
  })
})
