<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import useClickOutside from '../../hooks/useClickOutside'
import type { TooltipEmits, TooltipInstance, TooltipProps } from './types'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  openDelay: 0,
  closeDelay: 0,
})
const emits = defineEmits<TooltipEmits>()
let popperInstance: null | Instance = null

let events: Record<string, any> = reactive({})
let outerEvents: Record<string, any> = reactive({})

const popperContainerNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>() // 触发节点
const popperNode = ref<HTMLElement>() // 展示节点

const popperOptions = computed(() => {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9],
        },
      },
    ],
    ...props.popperOptions,
  }
})

defineOptions({
  name: 'VkTooltip',
})

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
  emits('visible-change', true)
}
const close = () => {
  isOpen.value = false
  emits('visible-change', false)
}

const openDebounce = debounce(open, props.openDelay)
const closeDebounce = debounce(close, props.closeDelay)

const openFinal = () => {
  closeDebounce.cancel()
  openDebounce()
}
const closeFinal = () => {
  openDebounce.cancel()
  closeDebounce()
}

// 控制 isOpen
const togglePopper = () => {
  if (isOpen.value)
    closeFinal()
  else
    openFinal()
}

const attachEvents = () => {
  if (props.trigger === 'hover') {
    events.mouseenter = openFinal
    outerEvents.mouseleave = closeFinal
  }
  else if (props.trigger === 'click') {
    events.click = togglePopper
  }
}
if (!props.manual)
  attachEvents()

watch(() => props.manual, (isManual) => {
  if (isManual) {
    events = {}
    outerEvents = {}
  }
  else {
    attachEvents()
  }
})
watch(() => props.trigger, (newTrigger, oldTrigger) => {
  if (newTrigger !== oldTrigger) {
    // clear the events
    events = {}
    outerEvents = {}
    attachEvents()
  }
})

// 当点击在此元素外层时，触发callback
useClickOutside(popperContainerNode, () => {
  if (props.trigger === 'click' && isOpen.value && !props.manual)
    closeFinal()

  if (isOpen.value)
    emits('click-outside', true)
})

watch(isOpen, (newValue) => {
  if (newValue) {
    if (triggerNode.value && popperNode.value)
      // 调整 触发节点、展示节点的位置
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
    else
      popperInstance?.destroy()
  }
}, { flush: 'post' }) // flush: 'post'，内部需要用到dom节点，dom节点更新完成后，再触发watch监听

onUnmounted(() => {
  popperInstance?.destroy()
})

defineExpose<TooltipInstance>({
  show: openFinal,
  hide: closeFinal,
})
</script>

<template>
  <div ref="popperContainerNode" class="vk-tooltip" v-on="outerEvents">
    <!-- 触发节点 -->
    <div ref="triggerNode" class="vk-tooltip__trigger" v-on="events">
      <slot />
    </div>

    <!-- 展示节点 -->
    <Transition :name="transition">
      <div v-if="isOpen" ref="popperNode" class="vk-tooltip__popper">
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow />
      </div>
    </Transition>
  </div>
</template>
