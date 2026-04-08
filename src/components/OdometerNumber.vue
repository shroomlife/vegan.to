<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  digits?: number
}>()

const digitArray = computed(() => {
  const str = Math.round(props.value).toString()
  const minDigits = props.digits ?? str.length
  const padded = str.padStart(minDigits, '0')
  return padded.split('').map((char, i) => ({
    key: `d${i}`,
    digit: parseInt(char, 10),
    isSeparator: false,
  }))
})

const formattedDigits = computed(() => {
  const raw = digitArray.value
  const result: Array<{ key: string; digit: number; isSeparator: boolean }> = []
  const len = raw.length
  for (let i = 0; i < len; i++) {
    result.push(raw[i]!)
    const posFromRight = len - 1 - i
    if (posFromRight > 0 && posFromRight % 3 === 0) {
      result.push({ key: `sep${i}`, digit: -1, isSeparator: true })
    }
  }
  return result
})
</script>

<template>
  <span class="odo">
    <span
      v-for="item in formattedDigits"
      :key="item.key"
      class="odo-slot"
    >
      <span v-if="item.isSeparator" class="odo-sep">.</span>
      <span v-else class="odo-cell">
        <span
          class="odo-strip"
          :style="{ transform: `translateY(${-item.digit * 10}%)` }"
        >
          <span v-for="n in 10" :key="n" class="odo-num">{{ n - 1 }}</span>
        </span>
      </span>
    </span>
  </span>
</template>

<style scoped>
.odo {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  gap: 2px;
}
.odo-slot {
  display: inline-block;
}
.odo-sep {
  display: inline-block;
  width: 0.3em;
  text-align: center;
  opacity: 0.3;
  font-weight: 400;
}
.odo-cell {
  display: inline-block;
  /* Use a fixed aspect ratio to prevent subpixel jitter */
  height: 1.2em;
  overflow: hidden;
  width: 0.72em;
  text-align: center;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 5px;
  position: relative;
}
.odo-cell::before,
.odo-cell::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 20%;
  z-index: 1;
  pointer-events: none;
}
.odo-cell::before {
  top: 0;
  background: linear-gradient(to bottom, currentColor, transparent);
  opacity: 0.06;
}
.odo-cell::after {
  bottom: 0;
  background: linear-gradient(to top, currentColor, transparent);
  opacity: 0.06;
}
.odo-strip {
  display: flex;
  flex-direction: column;
  /* GPU compositing — prevents subpixel jitter during animation */
  will-change: transform;
  transform: translateZ(0);
  transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.odo-num {
  height: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
