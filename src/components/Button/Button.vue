<script setup lang="ts">
import { ref } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { ButtonProps } from './types'

withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})

defineOptions({
  name: 'VkButton',
})

const _ref = ref<HTMLButtonElement>()

defineExpose({
  ref: _ref,
})
</script>

<template>
  <button
    ref="_ref"
    class="vk-button"
    :class="{
      [`vk-button--${type}`]: type,
      [`vk-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <Icon v-if="loading" icon="spinner" spin />
    <Icon v-if="icon" :icon="icon" />
    <span><slot /></span>
  </button>
</template>

<style scoped>

</style>
