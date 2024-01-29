<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from './components/Button/Button.vue'
import type {ButtonInstance} from '@/components/Button/types'

const buttonRef = ref<ButtonInstance | null>(null)

onMounted(() => {
  console.log(buttonRef.value?.ref)
})
</script>

<template>
  <main>
    <Button ref="buttonRef" type="primary" plain>
      Test Button
    </Button>
  </main>

  <a href="#">link</a>
  <h1>h1</h1>
  <h2>h2</h2>
  <h3>h3</h3>
</template>
