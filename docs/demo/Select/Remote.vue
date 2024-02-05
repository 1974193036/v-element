<script setup>
import { ref } from 'vue'
import Select from '@/components/Select/Select.vue'

const selectedRemoteValue = ref('')
const remoteFilter = (query) => {
  return new Promise((resolve) => {
    if (!query)
      resolve([])

    setTimeout(() => {
      const arr = ['a', 'b', 'c', 'd', 'e']
      const res = arr.filter(v => v.includes(query)).map(v => ({
        label: v,
        value: v,
      }))
      resolve(res)
    }, 500)
  })
}
</script>
<template>
  <Select
    v-model="selectedRemoteValue"
    placeholder="远程搜索"
    filterable
    remote
    :remote-method="remoteFilter"
    style="width: 500px"
  />
  <span>{{selectedRemoteValue}}</span>
</template>