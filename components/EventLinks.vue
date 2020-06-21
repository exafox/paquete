<template>
  <div class="event-links flex flex-wrap items-start -mx-2">
    <BaseButton
      v-if="event.link"
      tag="a"
      :href="event.link"
      target="_blank"
      rel="noopener noreferrer"
      class="mx-2 mb-2"
      :size="size"
      @click.prevent="trackClick"
    >
      {{ mainCTA }}
    </BaseButton>
    <BaseButton
      v-if="event.descriptionLink"
      tag="a"
      variant="secondary"
      :href="event.descriptionLink"
      target="_blank"
      rel="noopener noreferrer"
      class="mx-2 mb-2"
      :size="size"
      @click.prevent="trackClick"
    >
      Learn more
    </BaseButton>
    <BaseButton
      v-if="event.donationLink"
      tag="a"
      variant="secondary"
      :href="event.donationLink"
      target="_blank"
      rel="noopener noreferrer"
      class="mx-2 mb-2"
      :size="size"
      @click.prevent="trackClick"
    >
      Donate
    </BaseButton>
    <BaseButton
      v-if="isShareVisible"
      class="mx-2 mb-2"
      tag="button"
      type="button"
      variant="secondary"
      :size="size"
      @click="isShareModalOpen = true"
      >Share</BaseButton
    >
    <ShareModal
      v-if="isShareModalOpen"
      v-bind="shareProps"
      @close="isShareModalOpen = false"
    />
  </div>
</template>

<script>
import BaseButton from '~/components/BaseButton';
import TrackingEvents from '~/constants/TrackingEvents';

const ShareModal = () => import('~/components/ShareModal');

export default {
  components: { BaseButton, ShareModal },
  props: {
    event: {
      type: Object,
      default: null,
    },
    size: {
      type: String,
      default: 'sm',
    },
  },
  data() {
    return { isShareModalOpen: false };
  },
  computed: {
    isShareVisible() {
      return process.env.VARIANT === 'standalone';
    },
    mainCTA() {
      if (this.event.isAudio) {
        return 'Listen';
      }
      if (this.event.requiresRegistration) {
        return 'Register';
      }
      return 'Watch';
    },
    shareProps() {
      const { title, id } = this.event;
      const shareCopy = `Watch "${title}" on ${process.env.SHARE_TITLE}`;
      return {
        title: shareCopy,
        tweet: shareCopy,
        url: `${process.env.SHARE_URL}?id=${id}`,
      };
    },
  },
  methods: {
    trackClick(e) {
      const link = e.currentTarget.href;
      const trackingPayload = {
        event: TrackingEvents.CLICKED_EXTERNAL_LINK,
        title: this.event.title,
        date: this.event.startTime,
        link,
      };
      this.$gtm.push(trackingPayload);
      window.open(link, '_blank');
    },
  },
};
</script>
