<template>
  <iframe
    v-if="embedLink"
    class="absolute inset-0 w-full h-full"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    :src="embedLink"
  ></iframe>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  computed: {
    embedLink() {
      if (event.embedLink) {
        return event.embedLink;
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
        default:
          return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>