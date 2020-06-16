<template>
  <div class="event-badges flex -mx-1">
    <BadgeButton
      v-if="event.isAdult"
      tag="div"
      class="mx-1"
      title="May contain adult content"
    >
      <AdultIcon />
    </BadgeButton>
    <BadgeButton
      v-if="event.isAudio"
      tag="div"
      class="mx-1"
      title="Audio content"
    >
      <AudioIcon />
    </BadgeButton>
    <BadgeButton
      v-if="event.isCharity"
      tag="div"
      class="mx-1"
      title="This event is for charity. Please consider giving."
    >
      <DonateIcon />
    </BadgeButton>
    <BadgeButton
      v-if="event.isPaywall"
      tag="div"
      class="mx-1"
      title="May require paid ticket or subscription"
    >
      <PaywallIcon />
    </BadgeButton>
    <BadgeButton
      v-if="event.requiresRegistration"
      tag="div"
      class="mx-1"
      title="Requires registration"
    >
      <RegistrationIcon />
    </BadgeButton>
    <BadgeButton
      v-if="event.isSponsored"
      tag="div"
      class="mx-1"
      title="This listing is sponsored"
    >
      <SponsoredIcon />
    </BadgeButton>
  </div>
</template>

<script>
import AdultIcon from '~/assets/icons/adult.svg';
import AudioIcon from '~/assets/icons/audio.svg';
import BadgeButton from '~/components/BadgeButton';
import DonateIcon from '~/assets/icons/donate_sm.svg';
import PaywallIcon from '~/assets/icons/paywall.svg';
import RegistrationIcon from '~/assets/icons/registration.svg';
import SponsoredIcon from '~/assets/icons/sponsored.svg';

export default {
  components: {
    AdultIcon,
    AudioIcon,
    BadgeButton,
    DonateIcon,
    PaywallIcon,
    RegistrationIcon,
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
