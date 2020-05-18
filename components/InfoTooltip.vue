<template>
  <portal to="modal">
    <div class="fixed inset-0 bg-black opacity-25 z-40" />
    <FocusLock>
      <div
        ref="container"
        class="info-modal bg-white fixed p-4 md:p-12 rounded-md shadow-xl z-50"
        @click="$event.stopPropagation()"
      >
        <BostonGlobeLogo class="logo mb-8 mx-auto" />
        <h1 class="font-bold mb-4 text-xl">About This Project</h1>
        <p class="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          luctus odio ex, non luctus quam placerat et. Nam leo purus, sodales
          faucibus nisi id, facilisis pharetra dolor. Nulla blandit lacinia
          dolor, eget imperdiet urna ullamcorper vitae. Donec eu nibh laoreet,
          sodales nulla ac, viverra leo. Duis rutrum justo at lacus mollis, quis
          tempor lectus cursus. Mauris ac lacus nunc. Maecenas fermentum velit
          at nisl euismod, sit amet vehicula lacus faucibus.
        </p>
        <p class="mb-4">
          Phasellus sagittis urna at pulvinar convallis. Aenean sit amet nulla
          sapien. Curabitur sem ipsum, tempus nec arcu eu, lobortis malesuada
          est. Praesent ultrices dapibus nisl, vitae volutpat ligula convallis
          vel. Morbi iaculis, eros eu sodales semper, lorem metus tristique
          neque, maximus sagittis magna risus a risus. Maecenas id diam eu ante
          lacinia vehicula a ut elit. Aliquam semper iaculis semper. Aenean in
          tristique urna.
        </p>
        <BadgeButton
          type="button"
          class="absolute mr-2 mt-2 md:mr-4 md:mt-4 right-0 top-0"
          @click="$emit('close')"
        >
          <span class="sr-only">Close</span>
          <span class="leading-none text-xl" aria-hidden>&times;</span>
        </BadgeButton>
      </div>
    </FocusLock>
  </portal>
</template>

<script>
import FocusLock from 'vue-focus-lock';
import BadgeButton from '~/components/BadgeButton';
import BostonGlobeLogo from '~/assets/Boston-Globe-Logo-Digital.svg';

export default {
  components: { BadgeButton, BostonGlobeLogo, FocusLock },
  mounted() {
    document.addEventListener('keyup', this.handleKeyup);
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.handleKeyup);
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    handleKeyup(e) {
      if (e.keyCode === 27) {
        this.$emit('close');
      }
    },
    handleOutsideClick(e) {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.info-modal {
  left: 50%;
  max-height: calc(100vh - 32px);
  max-width: calc(100vw - 32px);
  overflow: auto;
  transform: translate(-50%, -50%);
  top: 50%;
  width: 600px;
}

.logo {
  max-width: 100%;
  width: 300px;
}
</style>
