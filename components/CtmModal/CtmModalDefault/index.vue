<template>
  <ctm-modal-box>
    <div class="ctm-modal__content ctm-modal__text">
      {{ options.text }}
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DefaultModal',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}
</style>
