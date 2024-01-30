<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
import type { ButtonInstance } from '@/components/Button/types'

const buttonRef = ref<ButtonInstance | null>(null)

const openedValue = ref(['a'])

const size = ref<any>('3x')

onMounted(() => {
  console.log(buttonRef.value?.ref)
  setTimeout(() => {
    // openedValue.value = ['a', 'b']
    size.value = '6x'
  }, 2000)
})
</script>

<template>
  <main>
    <Button ref="buttonRef">
      Test Button
    </Button>
    <Button plain>
      Plain Button
    </Button>
    <Button round>
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
