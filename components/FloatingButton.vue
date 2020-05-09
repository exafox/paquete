<template>
  <component
    :is="tag"
    class="cursor-pointer floating-button appearance-none h-12 inline-flex items-center justify-center rounded-full w-12 transition duration-200 ease-in-out shadow-md"
    :class="{
      'bg-red-700 hover:bg-red-600 text-white': variant === 'primary',
      'bg-gray hover:bg-blue text-blue hover:text-white':
        variant === 'secondary',
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
