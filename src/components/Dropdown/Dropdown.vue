<script setup lang="ts">
import { ref } from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/types'
import RenderVnode from '../common/RenderVnode'
import type { DropdownEmits, DropdownInstance, DropdownProps, MenuOption } from './types'

const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true,
})
const emits = defineEmits<DropdownEmits>()
const tooltipRef = ref<TooltipInstance | null>(null)
defineOptions({
  name: 'VkDropdown',
})

const visibleChange = (e: boolean) => {
  emits('visible-change', e)
}

const itemClick = (e: MenuOption) => {
  if (e.disabled)
    return

  emits('select', e)
  if (props.hideAfterClick)
    tooltipRef.value?.hide()
}

defineExpose<DropdownInstance>({
  // tooltipRef.value?.show这个方法不一定存在，采用闭包方式，确保让组件实例加载完
  // show: tooltipRef.value?.show,
  // hide: tooltipRef.value?.hide,

  // 正确做法
  show: () => tooltipRef.value?.show(),
  hide: () => tooltipRef.value?.hide(),
})
</script>

<template>
  <div
    class="vk-dropdown"
  >
    <Tooltip
      ref="tooltipRef"
      :trigger="trigger"
      :placement="placement"
      :popper-options="popperOptions"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      :manual="manual"
      @visible-change="visibleChange"
    >
      <slot />
      <template #content>
        <ul class="vk-dropdown__menu">
          <template v-for="item in menuOptions" :key="item.key">
            <li
              v-if="item.divided"
              role="separator"
              class="divided-placeholder"
            />
            <li
              :id="`dropdown-item-${item.key}`"
              class="vk-dropdown__item"
              :class="{ 'is-disabled': item.disabled, 'is-divided': item.divided }"
              @click="itemClick(item)"
            >
              <RenderVnode :vNode="item.label" />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
