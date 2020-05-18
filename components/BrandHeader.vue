<template>
  <header
    class="bg-white border-t-8 border-red h-16 flex flex-col justify-center items-center px-4 relative w-full"
  >
    <div class="font-bold leading-tight text-xs">Presented By</div>
    <div class="leading-tight">
      <span class="sr-only">The Boston Globe</span>
      <BostonGlobeLogo class="logo" />
    </div>
    <BadgeButton
      class="absolute mr-4 right-0"
      type="button"
      title="About this project"
      @click.stop="isShowingInfo = !isShowingInfo"
    >
      <span class="sr-only">About this project</span>
      <InfoIcon />
    </BadgeButton>
    <InfoModal v-if="isShowingInfo" @close="isShowingInfo = false" />
  </header>
</template>

<script>
import BadgeButton from '~/components/BadgeButton';
import BostonGlobeLogo from '~/assets/Boston-Globe-Logo-Digital.svg';
import InfoIcon from '~/assets/icons/info.svg';
const InfoModal = () => import('~/components/InfoModal');

export default {
  components: { BadgeButton, BostonGlobeLogo, InfoIcon, InfoModal },
  data() {
    return { isShowingInfo: false };
  },
};
</script>

<style scoped>
.logo {
  width: 150px;
}
</style>
