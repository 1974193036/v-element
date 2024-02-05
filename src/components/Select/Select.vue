<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { debounce, isFunction } from 'lodash-es'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/types'
import Input from '../Input/Input.vue'
import Icon from '../Icon/Icon.vue'
import type { InputInstance } from '../Input/types'
import RenderVnode from '../common/RenderVnode'
import type { SelectEmits, SelectOption, SelectProps, SelectStates } from './types'

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
})
const emits = defineEmits<SelectEmits>()
const findOption = (value: string) => {
  const option = props.options.find(option => option.value === value)
  return option || null
}
defineOptions({
  name: 'VkSelect',
})
const timeout = computed(() => props.remote ? 300 : 0)
const initialOption = findOption(props.modelValue)
const tooltipRef = ref() as Ref<TooltipInstance>
const inputRef = ref() as Ref<InputInstance>
const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1,
})
const isDropdownShow = ref(false)
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
    {
      name: 'sameWidth',
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`
      },
      phase: 'beforeWrite',
      requires: ['computeStyles'],
    },
  ],
}

const filterOptions = ref(props.options)
watch(() => props.options, (newOptions) => {
  filterOptions.value = newOptions
})
const generateFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filterOptions.value = props.filterMethod(searchValue)
  }
  else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    states.loading = true
    try {
      filterOptions.value = await props.remoteMethod(searchValue)
    }
    catch (e) {
      console.error(e)
      filterOptions.value = []
    }
    finally {
      states.loading = false
    }
  }
  else {
    filterOptions.value = props.options.filter(opt => opt.label.includes(searchValue))
  }
}

const onFilter = () => {
  generateFilterOptions(states.inputValue)
}
const debouceOnFilter = debounce(() => {
  onFilter()
}, timeout.value)

const filteredPlaceholder = computed(() => {
  return (props.filterable && states.selectedOption && isDropdownShow.value) ? states.selectedOption.label : props.placeholder
})
const controlDropdown = (show: boolean) => {
  if (show) {
    // filter模式
    // 之前选择过对应的值
    if (props.filterable && states.selectedOption)
      states.inputValue = ''
    if (props.filterable)
      generateFilterOptions(states.inputValue) // 进行一次默认选项的生成

    tooltipRef.value.show()
  }
  else {
    tooltipRef.value.hide()
    // blur 时候将之前的值回灌到input中
    if (props.filterable)
      states.inputValue = states.selectedOption ? states.selectedOption.label : ''
  }

  isDropdownShow.value = show
  emits('visible-change', show)
}

const showClearIcon = computed(() => {
  return props.clearable && states.mouseHover && states.selectedOption && states.inputValue.trim()
})
const onClear = () => {
  states.selectedOption = null
  states.inputValue = ''
  emits('clear')
  emits('change', '')
  emits('update:modelValue', '')
}
const NOOP = () => {}

const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdownShow.value)
    controlDropdown(false)
  else
    controlDropdown(true)
}
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return
  states.inputValue = e.label
  states.selectedOption = e
  emits('change', e.value)
  emits('update:modelValue', e.value)
  controlDropdown(false)
  inputRef.value.ref.focus()
}

const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdownShow.value) {
        controlDropdown(true)
      }
      else {
        if (states.highlightIndex > -1 && filterOptions.value[states.highlightIndex])
          itemSelect(filterOptions.value[states.highlightIndex])
        else
          controlDropdown(false)
      }
      break
    case 'Escape':
      if (isDropdownShow.value)
        controlDropdown(false)
      break
    case 'ArrowUp':
      e.preventDefault() // 阻止浏览器上下滚动行为
      if (filterOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === 0)
          states.highlightIndex = filterOptions.value.length - 1
        else
          states.highlightIndex--
      }
      break
    case 'ArrowDown':
      e.preventDefault() // 阻止浏览器上下滚动行为
      if (filterOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === filterOptions.value.length - 1)
          states.highlightIndex = 0
        else
          states.highlightIndex++
      }
      break
    default:
      break
  }
}
</script>

<template>
  <div
    class="vk-select"
    :class="{ 'is-disabled': disabled }"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false"
  >
    <Tooltip
      ref="tooltipRef"
      placement="bottom-start"
      :popperOptions="popperOptions"
      manual
      style="display: block"
      @click-outside="controlDropdown(false)"
    >
      <Input
        ref="inputRef"
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="filteredPlaceholder"
        :readonly="!filterable || !isDropdownShow"
        @input="debouceOnFilter"
        @keydown="handleKeydown"
      >
        <template #suffix>
          <Icon v-if="showClearIcon" icon="circle-xmark" class="vk-input__clear" @mousedown.prevent="NOOP" @click.stop="onClear" />
          <Icon v-else icon="angle-down" class="header-angle" :class="{ 'is-active': isDropdownShow }" />
        </template>
      </Input>
      <template #content>
        <div v-if="states.loading" class="vk-select__loading">
          <Icon icon="spinner" spin />
        </div>
        <div v-else-if="filterable && filterOptions.length === 0" class="vk-select__nodata">
          暂无数据
        </div>
        <ul v-else class="vk-select__menu">
          <template v-for="(item, _index) in filterOptions" :key="_index">
            <li
              :id="`select-item-${item.value}`"
              class="vk-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value === item.value,
                'is-highlighted': states.highlightIndex === _index,
              }"
              @click.stop="itemSelect(item)"
            >
              <RenderVnode :vNode="renderLabel ? renderLabel(item) : item.label" />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
