<template>
  <div class="comment">
    2
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RootCommentField',
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>

</style>
