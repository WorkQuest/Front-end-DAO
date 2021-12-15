<template>
  <div
    class="comment"
    :class="`comment_sub${level}`"
  >
    <span>[id:{{ data.id }}] {{ data.author.firstName }}</span>
    <span>: {{ data.text }}</span>
    <span>&nbsp;[{{ data.amountSubComments }} subs] [lvl: {{ level }}]</span>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    data: {
      type: Object,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  padding: 10px;
  display: flex;
  margin-bottom: 10px;
  background: $black100;
  &_sub2 {
   margin-left: 20px;
    background: $black200;
  }
  &_sub3 {
   margin-left: 40px;
    background: $black300;
  }
  &_sub4 {
   margin-left: 60px;
    background: $black400;
  }
  &_sub5 {
   margin-left: 80px;
    background: $black500;
  }
}
</style>
