<template>
  <iframe
    v-if="embedLink"
    :key="embedLink"
    ref="iframe"
    class="absolute inset-0 w-full h-full"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    :src="embedLink"
    @click="emit('click')"
  />
  <div v-else class="offline relative">
    <StaticNoise />
  </div>
</template>

<script>
import isFinite from 'lodash/isFinite';
import StaticNoise from '~/components/StaticNoise';

export default {
  components: { StaticNoise },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  computed: {
    embedLink() {
      if (this.event.embedLink) {
        return this.event.embedLink;
      }
      const url = new URL(this.event.link);
      switch (url.hostname) {
        case 'www.youtube.com':
        case 'youtube.com':
          return `https://www.youtube.com/embed/${url.searchParams.get(
            'v'
          )}?autoplay=1&mute=1&rel=0`;
        case 'www.livestream.com':
        case 'livestream.com':
          return `${this.event.link}/player?enableInfoAndActivity=true&autoPlay=true&mute=true`;
        case 'app.stitcher.com':
          return `https://app.stitcher.com/splayer/f/${url.pathname
            .split('/')
            .find((seg) => isFinite(parseInt(seg, 10)))}`;
        default:
          return null;
      }
    },
  },
  mounted() {
    if (!this.embedLink) return;
    this.monitor = setInterval(() => {
      const activeEl = document.activeElement;
      if (activeEl === this.$refs.iframe) {
        this.$emit('iframe-clicked');
        clearInterval(this.monitor);
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.monitor);
  },
};
</script>

<style lang="scss" scoped>
.offline {
  @apply absolute inset-0 w-full h-full;
  background: url('/offline.png') center center no-repeat;
  background-size: cover;
}
</style>
