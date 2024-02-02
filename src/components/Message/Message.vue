<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import RenderVnode from '../common/RenderVnode'
import Icon from '../Icon/Icon.vue'
import useEventListener from '../../hooks/useEventListener'
import type { MessageProps } from './types'
import { getLastBottomOffset } from './method'

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000,
  offset: 20,
  transitionName: 'fade-up',
})

const visible = ref(false)

const messageRef = ref<HTMLDivElement>()

let timer: ReturnType<typeof setTimeout>
function startTimer() {
  if (props.duration === 0) return
  timer = setTimeout(() => {
    visible.value = false
  }, props.duration)
}
function clearTimer() {
  clearTimeout(timer)
}

function keydown(e: Event) {
  const event = e as KeyboardEvent
  if (event.code === 'Escape')
    visible.value = false
}
useEventListener(document, 'keydown', keydown)

// 让动画结束之后，才进行组件的销毁。否则，没有动画效果。
function destroyComponent() {
  props.onDestory()
}

// 这个 div 的高度
const height = ref(0)
// 动画进入之后，进行计算高度
function updateHeight() {
  height.value = messageRef.value!.getBoundingClientRect().height
}

/**
 * 记录每一个组件的 topOffset、bottomOffset
 * 下一个组件的top为上一个组件的 bottomOffset + 20
 * 
 */

// 上一个实例的最下面的坐标数字，第一个是 0
const lastBottomOffset = computed(() => getLastBottomOffset(props.id))

// 这个元素应该使用的 top
const topOffset = computed(() => props.offset + lastBottomOffset.value)
// 这个元素为下一个元素预留的 offset，也就是它最低端 bottom 的 值
const bottomOffset = computed(() => height.value + topOffset.value)
const cssStyle = computed(() => ({
  top: `${topOffset.value}px`,
  zIndex: props.zIndex,
}))

onMounted(async () => {
  visible.value = true
  startTimer()
})

defineExpose({
  visible,
  bottomOffset,
})
</script>

<template>
  <Transition
    :name="transitionName"
    @after-leave="destroyComponent"
    @enter="updateHeight"
  >
    <div
      v-show="visible"
      ref="messageRef"
      class="vk-message"
      :class="{
        [`vk-message--${type}`]: type,
        'is-close': showClose,
      }"
      :style="cssStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="vk-message__content">
        <slot>
          <RenderVnode v-if="message" :vNode="message" />
        </slot>
      </div>
      <div v-if="showClose" class="vk-message__close">
        <Icon icon="xmark" @click.stop="visible = false" />
      </div>
    </div>
  </Transition>
</template>
