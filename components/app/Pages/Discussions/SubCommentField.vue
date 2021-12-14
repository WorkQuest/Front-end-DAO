<template>
  <div class="comment">
    <div class="comment__footer footer">
      <span class="icon-link footer__chain" />
      <input
        v-model="subCommentInput"
        class="footer__input"
        :placeholder="$t('discussions.input')"
      >
      <span
        class="icon-send footer__arrow"
        @click="addSubCommentResponse(elem.id)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SubCommentField',
  props: {
    elem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      subCommentInput: '',
    };
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
  },
  methods: {
    async addSubCommentResponse() {
      const discussionId = this.currentDiscussion.id;
      const payload = {
        rootCommentId: this.elem.id,
        text: this.subCommentInput,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { discussionId, payload });
      this.subCommentInput = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  &__input {
    @include text-usual;
    width: 1040px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    padding: 10px 20px 10px 15px;
    margin: 0 10px 0 10px;
  }
  &__chain {
    display: flex;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    color: #000000;
    font-size: 25px;
    cursor: pointer;
  }
  &__arrow {
    display: flex;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: #0083C7;
    cursor: pointer;
  }
}
.comment {
  &__footer {
    margin-top: 20px;
  }
}
</style>
