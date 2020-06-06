<template>
  <div
    class="font-sans loading-screen flex items-center justify-center fixed md:absolute inset-0 z-50"
  >
    <div class="loading" data-text="LOADING">LOADING</div>
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
// Stealing this from https://css-tricks.com/glitch-effect-text-images-svg/
.loading-screen {
  @apply bg-blue;
}

.loading {
  @apply text-6xl;
  color: white;
  position: relative;

  @media screen and (min-width: 768px) {
    font-size: 100px;
  }
}

@keyframes noise-anim {
  $steps: 20;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      clip-path: inset(#{$top}% 0 #{$bottom}% 0);
    }
  }
}
.loading::after {
  @apply bg-blue;
  content: attr(data-text);
  position: absolute;
  left: 2px;
  text-shadow: -1px 0 red;
  top: 0;
  color: white;
  overflow: hidden;
  animation: noise-anim 2s infinite linear alternate-reverse;
}

@keyframes noise-anim-2 {
  $steps: 20;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      clip-path: inset(#{$top}% 0 #{$bottom}% 0);
    }
  }
}
.loading::before {
  @apply bg-blue;
  content: attr(data-text);
  position: absolute;
  left: -2px;
  text-shadow: 1px 0 yellow;
  top: 0;
  color: white;
  overflow: hidden;
  animation: noise-anim-2 15s infinite linear alternate-reverse;
}
</style>
