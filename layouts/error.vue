<template>
  <div class="error-layout relative w-screen h-screen">
    <StaticNoise />
  </div>
</template>

<script>
import StaticNoise from '~/components/StaticNoise';
export default {
  components: { StaticNoise },
};
</script>

<style lang="scss" scoped>
.error-layout {
  background: url('/offline.png') center center no-repeat;
  background-size: cover;
}
</style>
