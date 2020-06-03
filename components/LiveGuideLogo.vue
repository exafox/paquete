<template functional>
  <div
    :class="[{ 'mt-2': props.showGlobeLogo }, data.class, data.staticClass]"
    class="live-guide-logo inline-flex relative w-full"
    v-bind="$options.getAttributes({ data, parent })"
    :style="{ height: 0, paddingTop: props.showGlobeLogo ? '35%' : '22%' }"
    v-on="listeners"
  >
    <img
      v-if="props.showGlobeLogo"
      class="absolute inset-0"
      src="~/assets/globe-live-guide-logo.png"
      alt="The Boston Globe - LiveGuide"
    />
    <img
      v-else
      src="~/assets/live-guide-logo.png"
      alt="LiveGuide"
      class="absolute inset-0"
    />
  </div>
</template>

<script>
import getAttributes from '~/util/getAttributes';

export default {
  props: {
    showGlobeLogo: {
      type: Boolean,
      default: true,
    },
  },
  getAttributes,
};
</script>
