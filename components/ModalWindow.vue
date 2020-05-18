<template>
  <portal to="modal">
    <div
      class="fixed inset-0 bg-black opacity-25 z-40"
      @click="$emit('close')"
    />
    <FocusLock>
      <div
        class="modal-window bg-white fixed p-4 md:p-12 rounded-md shadow-xl z-50"
      >
        <slot />
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

export default {
  components: { BadgeButton, FocusLock },
  mounted() {
    document.addEventListener('keyup', this.handleKeyup);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.handleKeyup);
  },
  methods: {
    handleKeyup(e) {
      if (e.keyCode === 27) {
        this.$emit('close');
      }
    },
  },
};
</script>

<style scoped>
.modal-window {
  left: 50%;
  max-height: calc(100vh - 32px);
  max-width: calc(100vw - 32px);
  overflow: auto;
  transform: translate(-50%, -50%);
  top: 50%;
  width: 600px;
}
</style>
