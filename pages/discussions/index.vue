<template>
  <div>
    <div class="discussions">
      <div class="discussions__title">
        {{ $t('discussions.title') }}
      </div>
      <div class="discussions__header">
        <!--        TODO: Добавить поиск-->
        <base-field
          v-model="search"
          class="discussions__search"
          :is-search="true"
          :placeholder="$t('discussions.seacrhField')"
        />
        <base-btn
          class="discussions__btn"
          @click="openModalAddDiscussion"
        >
          {{ $t('discussions.btn') }}
        </base-btn>
      </div>
      <div class="discussions__field">
        <div class="discussions__card">
          <discussion-card
            v-for="(item, i) in discussions"
            :key="i"
            :item="item"
          />
        </div>
      </div>
      <!--      TODO: Добавить пагинацию-->
      <base-pager
        v-model="pages"
        class="discussions__pagination"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {

  data() {
    return {
      search: '',
      pages: 1,
      totalPages: 5,
    };
  },
  computed: {
    ...mapGetters({
      discussions: 'discussions/getDiscussions',
    }),
  },
  mounted() {
    this.getDiscussions();
  },
  methods: {
    async getDiscussions() {
      await this.$store.dispatch('discussions/getDiscussions');
    },
    openModalAddDiscussion() {
      this.ShowModal({
        key: modals.addDiscussion,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.discussions {
    justify-content: center;
    max-width: 1180px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    @include _1024;
    &__title{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    margin-right: auto;
    padding: 30px 0px 30px 0px;
    }
    &__field{
    justify-content: space-between;
    }
    &__card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px 20px;
    margin-bottom: 15px;
    }
    &__header {
      display: flex;
      justify-content: space-between;
      margin: 0px 0px 30px 0px;
    }
    &__search {
        width: 680px;
        height: 43px;
        background: #FFFFFF;
        border-radius: 6px;
        align-items: end;
        color: #D8DFE3;
        font-size: 16px;
        line-height: 130%;
    }

    &__btn {
        width: 220px;
        height: 43px;
      }
    &__pagination{
      margin-top: 5px;
    }
    }
</style>
