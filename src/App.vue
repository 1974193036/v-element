<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
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
import Select from '@/components/Select/Select.vue'
import Form from '@/components/Form/Form.vue'
import FormItem from '@/components/Form/FormItem.vue'
import type { FormRules } from '@/components/Form/types'

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

const selectedValue = ref('1')
const selectOptions = [
  { label: 'hello', value: '1' },
  { label: 'xyz', value: '2' },
  { label: 'testing', value: '3' },
  { label: 'check', value: '4', disabled: true },
]
const customRender = (option: any) => {
  return h('div', `${option.label} - ${option.value}`)
}

const selectedRemoteValue = ref('')
const remoteFilter = (query: string): Promise<{ label: string; value: string }[]> => {
  return new Promise((resolve) => {
    if (!query)
      resolve([])

    setTimeout(() => {
      const arr = ['a', 'b', 'c', 'd', 'e']
      const res = arr.filter(v => v.includes(query)).map(v => ({
        label: v,
        value: v,
      }))
      resolve(res)
    }, 500)
  })
}

const formRef = ref()
const model = reactive({
  email: '123',
  password: '',
})
const rules: FormRules = {
  email: [{ type: 'email', required: true, trigger: 'blur' }],
  password: [{ type: 'string', required: true, trigger: 'blur', min: 3, max: 5 }],
}

const submit = async () => {
  try {
    await formRef.value.validate()
    console.log('passed!')
  }
  catch (e) {
    console.log('the error', e)
  }
}
const reset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <Form ref="formRef" :model="model" :rules="rules">
    <FormItem label="邮箱" prop="email">
      <Input v-model="model.email" />
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input v-model="model.password" type="password" />
    </FormItem>
    <div :style="{ textAlign: 'center' }">
      <Button type="primary" @click.prevent="submit">
        Submit
      </Button>
      <Button @click.prevent="reset">
        Reset
      </Button>
    </div>
  </Form>
  <pre>{{ model }}</pre>

  <Select
    v-model="selectedValue"
    placeholder="基础选择器，请选择"
    :options="selectOptions"
    clearable
    style="width: 500px"
  />

  <Select
    v-model="selectedValue"
    placeholder="可筛选，可自定义模板"
    :options="selectOptions"
    clearable
    filterable
    :render-label="customRender"
    style="width: 500px"
  />

  <Select
    v-model="selectedRemoteValue"
    placeholder="远程搜索"
    filterable
    remote
    :remote-method="remoteFilter"
    style="width: 500px"
  />

  <br><br>

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
  <Input v-model="inputValue" type="textarea" />

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
