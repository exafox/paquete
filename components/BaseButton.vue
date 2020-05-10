<template>
  <component
    :is="tag"
    class="base-button appearance-none font-bold rounded-sm text-center transition duration-200 ease-in-out whitespace-no-wrap"
    :class="{
      'bg-red hover:opacity-75 text-white': variant === 'primary',
      'bg-gray hover:bg-blue text-blue hover:text-white':
        variant === 'secondary',
      block: block,
      'px-8 py-2 text-lg': size === 'lg',
      'px-6 py-1 text-base': size === 'sm',
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
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'lg',
    },
  },
};
</script>
