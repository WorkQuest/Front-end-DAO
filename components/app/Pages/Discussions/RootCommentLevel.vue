<template>
  <div class="comment">
    <div
      v-if="rootCommentIdArray.includes(elem.id) && subComments.count === 0"
      class="comment__container"
    >
      <span class="comment__text">{{ $t('discussions.comments.noComments') }}</span>
    </div>
    <div
      v-if="rootCommentIdArray.includes(elem.id) && subComments.count > 0"
      class="comment__container"
    >
      <sub-comment-level
        v-for="(item) in filterSubComments(elem.id)"
        :key="item.id"
        :item="item"
      />
    </div>
    <base-btn
      v-if="rootCommentIdArray.includes(elem.id) && subComments.count > 0"
      mode="blue"
      class="comment__btn"
    >
      {{ $t('discussions.more') }}
    </base-btn>
  </div>
</template>

<script>

export default {
  name: 'RootCommentLevel',
  props: {
    elem: {
      type: [Object],
      default: () => {},
    },
    subComments: {
      type: [Object],
      default: () => {},
    },
    rootCommentIdArray: {
      type: [Array],
      default: () => [],
    },
  },
  methods: {
    filterSubComments(rootCommentId) {
      const subComments = this.subComments.comments;
      return subComments.filter((subComment) => subComment.rootCommentId === rootCommentId);
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  &__btn {
    border: none;
    outline: none;
    align-items: center;
    width: 190px;
    height: 33px;
    border-radius: 6px;
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>
