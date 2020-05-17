<template>
  <div class="event-badges flex -mx-1">
    <div v-if="event.isAdult" class="badge" title="May contain adult content">
      <AdultIcon />
    </div>
    <div v-if="event.isAudio" class="badge" title="Audio content">
      <AudioIcon />
    </div>
    <div
      v-if="event.isCharity"
      class="badge"
      title="This event is for charity. Please consider giving."
    >
      <DonateIcon />
    </div>
    <div
      v-if="event.isPaywall"
      class="badge"
      title="May require paid ticket or subscription"
    >
      <PaywallIcon />
    </div>
    <div
      v-if="event.isSponsored"
      class="badge"
      title="This listing is sponsored"
    >
      <SponsoredIcon />
    </div>
  </div>
</template>

<script>
import AdultIcon from '~/assets/icons/adult.svg';
import AudioIcon from '~/assets/icons/audio.svg';
import DonateIcon from '~/assets/icons/donate_sm.svg';
import PaywallIcon from '~/assets/icons/paywall.svg';
import SponsoredIcon from '~/assets/icons/sponsored.svg';

export default {
  components: {
    AdultIcon,
    AudioIcon,
    DonateIcon,
    PaywallIcon,
    SponsoredIcon,
  },
  props: {
    event: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.badge {
  @apply bg-dark-gray flex h-6 items-center justify-center mx-1 rounded-full text-white w-6;
  svg {
    position: relative;
    top: -1px;
  }
}
</style>
