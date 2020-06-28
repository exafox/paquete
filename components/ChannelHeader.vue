<template>
  <component
    :is="tag"
    :class="[
      'bg-black',
      'flex',
      'font-bold',
      'items-center',
      'justify-center',
      'p-2',
      'text-center',
      'text-sm',
      'text-white',
      'uppercase',
    ]"
  >
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
};
</script>
