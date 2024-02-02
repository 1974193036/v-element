import { isRef, onBeforeUnmount, onMounted, unref, watch } from 'vue'
import type { Ref } from 'vue'

export default function useEventListener(
  target: Ref<EventTarget | null> | EventTarget,
  event: string,
  handler: (e: Event) => any,
) {
  if (isRef(target)) {
    watch(target, (value, oldValue) => {
      oldValue?.removeEventListener(event, handler)
      value?.addEventListener(event, handler)
    })
  }
  else {
    onMounted(() => {
      target.addEventListener(event, handler)
    })
  }

  onBeforeUnmount(() => {
    // 辅助函数unref
    // 如果target是一个ref类型，返回ref.value
    // 如果target不是一个ref类型，则返回本身
    unref(target)?.removeEventListener(event, handler)
  })
}
