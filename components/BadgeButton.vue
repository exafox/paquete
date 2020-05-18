<template>
  <component
    :is="tag"
    class="bg-dark-gray flex h-6 items-center justify-center focus:outline-none focus:shadow-outline rounded-full text-white w-6"
    :class="{
      'opacity-50': disabled,
      'cursor-not-allowed': disabled,
    }"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
