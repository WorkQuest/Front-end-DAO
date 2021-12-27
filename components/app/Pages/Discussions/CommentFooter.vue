<template>
  <validation-observer
    v-slot="{handleSubmit, invalid}"
  >
    <div
      class="comment__footer footer"
    >
      <base-btn
        class="footer__btn hide"
      >
        <template v-slot:left>
          <span class="icon-link footer__chain" />
        </template>
      </base-btn>
      <base-field
        v-model="subCommentInput"
        class="footer__input"
        :placeholder="$t('discussions.input')"
        rules="required|max:250"
        :name="$t('discussions.response')"
        mode="comment-field"
        @keyup.enter.native="handleSubmit(addSubCommentResponse(comment, level))"
      />
      <base-btn
        class="footer__btn"
        :disabled="!isComplete() || invalid"
        @click="handleSubmit(addSubCommentResponse(comment, level))"
      >
        <template v-slot:left>
          <span
            class="icon-send footer__arrow"
            :class="{'footer__arrow_blue': isComplete()}"
          />
        </template>
      </base-btn>
    </div>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CommentFooter',
  props: {
    comment: {
      type: Object,
      default: () => {},
    },
    level: {
      type: [String, Number],
      default: () => '',
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
    isComplete() {
      return this.subCommentInput;
    },
    async addSubCommentResponse(comment, level) {
      const payload = {
        rootCommentId: comment.id,
        text: this.subCommentInput,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
      this.$parent.showSubs = true;
      this.$parent.isReply = false;
      await this.$parent.loadSubs(comment.id, level);
      this.subCommentInput = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.base-btn {
  &_disabled {
    background: transparent !important;
  }
}
.comment {
  animation: show  1s 1;
  padding: 0 30px 0 0;
  display: flex;
  &__footer {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 11fr 1fr;
    margin: 20px;
    align-items: center;
  }
}
.footer {
  animation: show  1s 1;
  display: flex;
  &__input {
    @include text-usual;
    width: 100%;
    height: 40px;
    border-radius: 6px;
    border: none;
    padding: 10px 15px 10px 15px;
    margin: 0 0 20px 0;
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
  &__btn {
    width: 40px !important;
    height: 40px !important;
    background: #F7F8FA;
    cursor: pointer;
    &:hover {
      background: #F7F8FA;
    }
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
    color: $black500;
    cursor: pointer;
    &_blue {
      color: #0083C7;
    }
  }
}
</style>
