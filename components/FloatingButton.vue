<template>
  <component
    :is="tag"
    class="focus:outline-none focus:shadow-outline floating-button cursor-pointer appearance-none h-12 inline-flex items-center justify-center rounded-full w-12 transition duration-200 ease-in-out shadow-md"
    :class="{
      'bg-red hover:bg-dark-red text-white': variant === 'primary',
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
