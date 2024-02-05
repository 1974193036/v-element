<script setup>
import { h, ref } from 'vue'
import Select from '@/components/Select/Select.vue'
const test = ref('1')
const options2 = [
  { label: 'hello', value: '1' },
  { label: 'xyz', value: '2' },
  { label: 'testing', value: '3' },
  { label: 'check', value: '4', disabled: true }
]
const customRender = (option) => {
  return h('div', `${option.label} - ${option.value}`)
}
</script>
<template>
  <Select
    v-model="test"
    placeholder="可筛选，可自定义模板"
    :options="options2"
    clearable
    filterable
    :render-label="customRender"
    style="width: 500px"
  />
  <span>{{test}}</span>
</template>