<template>
  <ModalWindow @close="$emit('close')">
    <BostonGlobeLogo class="logo mb-8 mx-auto" />
    <h1 class="font-bold mb-4 text-xl">About This Project</h1>
    <p>
      The Boston Globe is proud to present LiveGuide, your daily schedule of the
      latest livestreams and other content from around the internet. Stay tuned
      for entertainment, news, virtual events, and the Globe's critics' picks.
      Do you have a livestream you’d like us to consider including in LiveGuide?
      Provide us with the details
      <a
        href="https://forms.gle/AJTqLsaVjimqLPsv6"
        class="text-blue underline"
        target="_blank"
        rel="noopener noreferrer"
        >here</a
      >.
    </p>
  </ModalWindow>
</template>

<script>
import BostonGlobeLogo from '~/assets/Boston-Globe-Logo-Digital.svg';
import ModalWindow from '~/components/ModalWindow';

export default {
  components: { BostonGlobeLogo, ModalWindow },
};
</script>

<style lang="scss" scoped>
.logo {
  max-width: 100%;
  width: 300px;
}
</style>
