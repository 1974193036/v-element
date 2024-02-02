import { computed, ref } from 'vue'

const zIndex = ref(0)
const useZIndex = (initialValue = 2000) => {
  const initialZIndex = ref(initialValue)
  const currentZIndex = computed(() => zIndex.value + initialZIndex.value)
  const nextZIndex = () => {
    zIndex.value++
    // console.log(currentZIndex.value) // 2001
    return currentZIndex.value
  }
  return {
    currentZIndex,
    nextZIndex,
    initialZIndex // 返回这个，可以在外部调整初始值
  }
}

export default useZIndex
