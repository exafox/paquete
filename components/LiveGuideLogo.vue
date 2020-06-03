<template functional>
  <div
    :class="[data.class, data.staticClass]"
    class="live-guide-logo inline-flex"
    v-bind="$options.getAttributes({ data, parent })"
    v-on="listeners"
  >
    <img
      v-if="props.showGlobeLogo"
      class="mt-2"
      src="~/assets/globe-live-guide-logo.png"
      alt="The Boston Globe - LiveGuide"
    />
    <img v-else src="~/assets/live-guide-logo.png" alt="LiveGuide" />
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
