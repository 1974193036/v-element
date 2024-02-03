<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import type { Ref } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { InputEmits, InputProps } from './types'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off',
})

const emits = defineEmits<InputEmits>()

defineOptions({
  name: 'VkInput',
  inheritAttrs: false,
})

const attrs = useAttrs()
const isFocus = ref(false)
const innerValue = ref(props.modelValue)
const inputRef = ref() as Ref<HTMLInputElement>
const showClear = computed(() =>
  props.clearable
  && !props.disabled
  && !!innerValue.value
  && isFocus.value,
)
const showPasswordArea = computed(() =>
  props.showPassword
  && !props.disabled
  && !!innerValue.value,
)

const keepFocus = async () => {
  await nextTick()
  inputRef.value.focus()
}

const handleInput = () => {
  emits('update:modelValue', innerValue.value)
  emits('input', innerValue.value)
}
const handleChange = () => {
  emits('change', innerValue.value)
}
const handleFocus = (event: FocusEvent) => {
  isFocus.value = true
  emits('focus', event)
}
const handleBlur = (event: FocusEvent) => {
  console.log('blur triggered')
  isFocus.value = false
  emits('blur', event)
}
const clear = () => {
  console.log('clear triggered')
  innerValue.value = ''
  emits('update:modelValue', '')
  emits('clear')
  emits('input', '')
  emits('change', '')
}
const NOOP = () => {}

const passwordVisible = ref(false)
const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}

watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})

defineExpose({
  ref: inputRef,
})
</script>

<template>
  <div
    class="vk-input"
    :class="{
      [`vk-input--${type}`]: type,
      [`vk-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus,
    }"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" class="vk-input__prepend">
        <slot name="prepend" />
      </div>
      <div class="vk-input__wrapper">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="vk-input__prefix">
          <slot name="prefix" />
        </span>
        <input
          ref="inputRef"
          v-bind="attrs"
          v-model="innerValue"
          class="vk-input__inner"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        >
        <span v-if="$slots.suffix || showClear || showPasswordArea" class="vk-input__suffix" @click="keepFocus">
          <slot name="suffix" />
          <Icon
            v-if="showClear"
            icon="circle-xmark"
            class="vk-input__clear"
            @click="clear"
            @mousedown.prevent="NOOP"
          />
          <Icon
            v-if="showPasswordArea && passwordVisible"
            icon="eye"
            class="vk-input__password"
            @click="togglePasswordVisible"
          />
          <Icon
            v-if="showPasswordArea && !passwordVisible"
            icon="eye-slash"
            class="vk-input__password"
            @click="togglePasswordVisible"
          />
        </span>
      </div>
      <!-- append slot -->
      <div v-if="$slots.append" class="vk-input__append">
        <slot name="append" />
      </div>
    </template>
    <!-- textarea -->
    <template v-else>
      <textarea
        v-bind="attrs"
        ref="inputRef"
        v-model="innerValue"
        class="vk-textarea__wrapper"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </template>
  </div>
</template>
