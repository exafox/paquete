<template>
  <div class="event-links flex flex-wrap -mx-2">
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
  </div>
</template>

<script>
import BaseButton from '~/components/BaseButton';
import TrackingEvents from '~/constants/TrackingEvents';

export default {
  components: { BaseButton },
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
  computed: {
    mainCTA() {
      if (this.event.isAudio) {
        return 'Listen';
      }
      if (this.event.requiresRegistration) {
        return 'Register';
      }
      return 'Watch';
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
