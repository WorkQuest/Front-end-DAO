<template>
  <div class="info">
    <div>nuxt link</div>
    <div>title</div>
    <div></div>
      <div class="discussions__card">
        <discussion-card
            v-for="(item, i) in discussions"
            :key="i"
            :item="item"
        />
      </div>
  </div>
</template>
<script>
export default {
  name: 'Index',
};
</script>

<style scoped>

</style>
