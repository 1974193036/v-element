<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import Button from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'
import Dropdown from './components/Dropdown/Dropdown.vue'
// import Message from './components/Message/Message.vue'
import Input from './components/Input/Input.vue'
import Switch from './components/Switch/Switch.vue'
import type { MenuOption } from './components/Dropdown/types'
import { createMessage } from './components/Message/method'
import type { ButtonInstance } from '@/components/Button/types'
import type { TooltipInstance } from '@/components/Tooltip/types'

const buttonRef = ref<ButtonInstance | null>(null)
const tootipRef = ref<TooltipInstance | null>(null)

const openedValue = ref(['a'])

const size = ref<any>('3x')

const loading = ref(true)

onMounted(() => {
  // console.log(buttonRef.value?.ref)
  setTimeout(() => {
    // openedValue.value = ['a', 'b']
    size.value = '6x'
    loading.value = true
  }, 2000)
})

const open = () => {
  // tootipRef.value?.show()
  createMessage({ message: 'hello world', duration: 0, showClose: true, type: 'success' })
}
const close = () => {
  // tootipRef.value?.hide()
  // closeAll()
}

const options: MenuOption[] = [
  { key: 1, label: h('b', 'this is bold') },
  { key: 2, label: 'item2', disabled: true },
  { key: 3, label: 'item3', divided: true },
  { key: 4, label: 'item4' },
]

const inlineConsole = (...args: any) => {
  console.log(...args)
}

const inputValue = ref('123')

const switchValue = ref(false)
</script>

<template>
  <!-- <Message message="hello" /> -->

  <Input v-model="inputValue" a="1" b="2" placeholder="请输入" clearable />
  <Input v-model="inputValue" show-password placeholder="请输入" />
  <Input v-model="inputValue">
    <template #prepend>
      prepend
    </template>
    <template #prefix>
      prefix
    </template>
    <template #suffix>
      suffix
    </template>
    <template #append>
      append
    </template>
  </Input>
  <Input v-model="inputValue" type="textarea"/>

  <Switch v-model="switchValue" activeText="是" inactiveText="否" /> {{ switchValue }}

  <header>
    <Dropdown
      placement="bottom"
      trigger="click"
      :menu-options="options"
      @visible-change="e => inlineConsole('visible change', e)"
      @select="e => inlineConsole('select', e)"
    >
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125">
    </Dropdown>
  </header>

  <main style="margin-left: 100px">
    <Tooltip ref="tootipRef" content="测试" placement="right" style="margin-right: 20px;margin-top: 50px">
      <Button ref="buttonRef">
        Test Button
      </Button>
    </Tooltip>
    <Button plain @click="open">
      Plain Button
    </Button>
    <Button round @click="close">
      Round Button
    </Button>
    <Button circle>
      CB
    </Button>
    <Button disabled>
      Disabled Button
    </Button><br><br>
    <Button type="primary">
      Primary
    </Button>
    <Button type="success">
      Success
    </Button>
    <Button type="info">
      Info
    </Button>
    <Button type="warning">
      Warning
    </Button>
    <Button type="danger">
      Danger
    </Button><br><br>
    <Button type="primary" plain>
      Primary
    </Button>
    <Button type="success" plain>
      Success
    </Button>
    <Button type="info" plain>
      Info
    </Button>
    <Button type="warning" plain>
      Warning
    </Button>
    <Button type="danger" plain>
      Danger
    </Button><br><br>
    <Button size="large">
      Large
    </Button>
    <Button size="small">
      Small
    </Button><br><br>
    <Button size="large" :loading="loading">
      Loading
    </Button>
    <Button size="small" icon="arrow-up">
      Icon
    </Button><br><br>

    <Collapse v-model="openedValue">
      <CollapseItem name="a" title="标题A">
        <h1>headline title</h1>
        <div> this is content a aaa </div>
      </CollapseItem>
      <CollapseItem name="b" title="标题B">
        <div> this is bbbbb test </div>
      </CollapseItem>
      <CollapseItem name="c" title="标题C" disabled>
        <div> this is cccc test </div>
      </CollapseItem>
    </Collapse>
    {{ openedValue }}<br><br>

    <Icon icon="user-secret" :size="size" type="danger" color="#444312" />
  </main>
</template>
