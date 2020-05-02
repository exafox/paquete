<template>
  <component
    :is="tag"
    class="base-button appearance-none font-bold px-8 py-2 rounded-md text-center text-lg transition duration-200 ease-in-out"
    :class="{
      'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white':
        variant === 'primary',
      'bg-white hover:bg-gray-100 text-blue': variant === 'secondary',
      block: block,
      'w-full': block,
      'inline-block': !block,
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
    variant: {
      type: String,
      default: 'primary',
    },
    block: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
