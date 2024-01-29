<script setup lang="ts">
import type { ButtonProps } from './types'

defineProps<ButtonProps>()

defineOptions({
  name: 'VKButton',
})
</script>

<template>
  <button
    class="vk-button"
    :class="{
      [`vk-button--${type}`]: type,
      [`vk-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
    }"
    :disabled="disabled"
  >
    <span><slot /></span>
  </button>
</template>

<style scoped>

</style>
