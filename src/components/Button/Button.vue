<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'

withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button'
})

defineOptions({
  name: 'VKButton',
})

const _ref = ref<HTMLButtonElement>()

defineExpose({
  ref: _ref
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
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <span><slot /></span>
  </button>
</template>

<style scoped>

</style>
