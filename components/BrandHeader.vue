<template>
  <header
    class="bg-white flex flex-col justify-center items-center pb-4 px-4 relative w-full"
  >
    <div class="w-32 md:w-48 flex-shrink-0">
      <LiveGuideLogo :show-globe-logo="showGlobeLogo" />
    </div>
    <p class="font-sans mt-3 text-center text-xs">
      Your daily guide to the best livestreams, virtual events, Globe’s critics’
      picks, and more
    </p>
  </header>
</template>

<script>
import LiveGuideLogo from '~/components/LiveGuideLogo';

export default {
  components: { LiveGuideLogo },
  computed: {
    showGlobeLogo() {
      return process.env.VARIANT !== 'globe';
    },
  },
};
</script>
