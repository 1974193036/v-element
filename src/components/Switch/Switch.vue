<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { SwtichEmits, SwtichProps } from './types'

const props = withDefaults(defineProps<SwtichProps>(), {
  activeValue: true,
  inactiveValue: false,
})
const emits = defineEmits<SwtichEmits>()
defineOptions({
  name: 'VkSwtich',
  inheritAttrs: false,
})

const innerValue = ref(props.modelValue)
const input = ref<HTMLInputElement>()
// 现在是否被选中
const checked = computed(() => innerValue.value === props.activeValue)

const switchValue = () => {
  if (props.disabled) return
  const newValue = checked.value ? props.inactiveValue : props.activeValue
  innerValue.value = newValue
  emits('update:modelValue', newValue)
  emits('change', newValue)
}

onMounted(() => {
  input.value!.checked = checked.value
})
watch(checked, (val) => {
  input.value!.checked = val 
})
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})
</script>

<template>
  <div
    class="vk-switch"
    :class="{
      [`vk-switch--${size}`]: size,
      'is-disabled': disabled,
      'is-checked': checked,
    }"
    @click="switchValue"
  >
    <!-- input: 和原生表单的配合，实现比较完美的可访问性
    当在表单上按tab键，聚焦到该input元素上，可以按回车（keydown.enter）进行操作，并且给相应的自定义.vk-switch__core添加样式 -->
    <input
      ref="input"
      class="vk-swtich__input"
      type="checkbox"
      role="switch"
      :name="name"
      :disabled="disabled"
      @keydown.enter="switchValue"
    >
    <div class="vk-switch__core">
      <div class="vk-switch__core-inner">
        <span v-if="activeText || inactiveText" class="vk-switch__core-inner-text">
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="vk-switch__core-action" />
    </div>
  </div>
</template>
