<template>
  <ModalWindow @close="$emit('close')">
    <BostonGlobeLogo class="logo mb-8 mx-auto" />
    <h1 class="font-bold mb-4 text-xl">About This Project</h1>
    <p class="mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus
      odio ex, non luctus quam placerat et. Nam leo purus, sodales faucibus nisi
      id, facilisis pharetra dolor. Nulla blandit lacinia dolor, eget imperdiet
      urna ullamcorper vitae. Donec eu nibh laoreet, sodales nulla ac, viverra
      leo. Duis rutrum justo at lacus mollis, quis tempor lectus cursus. Mauris
      ac lacus nunc. Maecenas fermentum velit at nisl euismod, sit amet vehicula
      lacus faucibus.
    </p>
    <p class="mb-4">
      Phasellus sagittis urna at pulvinar convallis. Aenean sit amet nulla
      sapien. Curabitur sem ipsum, tempus nec arcu eu, lobortis malesuada est.
      Praesent ultrices dapibus nisl, vitae volutpat ligula convallis vel. Morbi
      iaculis, eros eu sodales semper, lorem metus tristique neque, maximus
      sagittis magna risus a risus. Maecenas id diam eu ante lacinia vehicula a
      ut elit. Aliquam semper iaculis semper. Aenean in tristique urna.
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
