<script setup lang="ts">
interface Props {
  percent: number;
  size?: number;
  borderWidth?: number;
  fillColor?: string;
  emptyColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 250,
  borderWidth: 30,
  fillColor: '#3b82f6',
  emptyColor: '#e1e1e1',
});

const radius = computed(() => (props.size - props.borderWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const offset = computed(() => circumference.value - (props.percent / 100) * circumference.value);
</script>

<template>
  <div class="circle-progress" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size">
      <!-- Círculo de fondo -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="emptyColor"
        :stroke-width="borderWidth"
        fill="none"
      />
      <!-- Círculo de progreso -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="fillColor"
        :stroke-width="borderWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        stroke-linecap="round"
        transform-origin="center"
        style="transform: rotate(-90deg); transition: stroke-dashoffset 0.5s ease"
      />
    </svg>
    <!-- Texto central -->
    <div class="circle-progress-text">
      <span class="text-4xl font-bold">{{ percent }}%</span>
    </div>
  </div>
</template>

<style scoped>
.circle-progress {
  position: relative;
  display: inline-block;
}

.circle-progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>