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
import { fetchEmbeddableStatus } from '~/services/youtubeApi';

export default {
  components: { StaticNoise },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      embedLink: null,
    };
  },
  watch: {
    event: {
      async handler(newVal) {
        let newEventLink = this.buildEmbedUrl(newVal);
        if (newEventLink && newEventLink.includes('youtube')) {
          const url = new URL(this.event.link);
          const videoId = url.searchParams.get('v');
          const isEmbeddable = await this.isYoutubeEmbeddable(videoId);
          if (!isEmbeddable) {
            newEventLink = null;
          }
        }
        this.embedLink = newEventLink;
      },
      immediate: true,
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
  methods: {
    buildEmbedUrl(event) {
      if (event.embedLink) {
        const url = new URL(event.embedLink);
        // Twitch requires that we include the domain of the embedding parent
        // window. Add that here.
        if (url.hostname === 'player.twitch.tv') {
          return event.embedLink + `&parent=${window.location.hostname}`;
        }
        return event.embedLink;
      }
      const url = new URL(event.link);
      switch (url.hostname) {
        case 'www.youtube.com':
        case 'youtube.com':
          return `https://www.youtube.com/embed/${url.searchParams.get(
            'v'
          )}?autoplay=1&mute=1&rel=0`;
        case 'www.twitch.tv':
          // Same issue as above of Twitch requiring the parent window's domain.
          return `https://player.twitch.tv/?channel=${url.pathname
            .split('/')
            .find((seg) => seg)}?parent=${window.location.hostname}`;
        case 'app.stitcher.com':
          return `https://app.stitcher.com/splayer/f/${url.pathname
            .split('/')
            .find((seg) => isFinite(parseInt(seg, 10)))}`;
        default:
          return null;
      }
    },
    async isYoutubeEmbeddable(videoId) {
      try {
        return await fetchEmbeddableStatus(videoId);
      } catch (err) {
        return false;
      }
    },
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
