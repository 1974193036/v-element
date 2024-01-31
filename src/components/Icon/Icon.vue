<script setup lang="ts">

// 图标库地址：https://fontawesome.com/search

import { computed } from 'vue'
import { omit } from 'lodash-es'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconProps } from './types'

const props = defineProps<IconProps>()
defineOptions({
  name: 'VkIcon',
  inheritAttrs: false,
})

const filteredProps = computed(() => omit(props, ['type', 'color']))
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
</script>

<template>
  <i class="vk-icon" :class="{ [`vk-icon--${type}`]: type }" :style="customStyles" v-bind="$attrs">
    <FontAwesomeIcon v-bind="filteredProps" />
  </i>
</template>
