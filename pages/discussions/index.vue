<template>
  <div>
    <div class="discussions">
      <div class="discussions__title">
        {{ $t('discussions.title') }}
      </div>
      <div class="discussions__header">
        <base-field
          v-model="search"
          class="discussions__search"
          :is-hide-error="true"
          :is-search="true"
          :placeholder="$t('discussions.seacrhField')"
          @input="discussionFilter"
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
          <div v-if="discussions.length === 0">
            {{ $t('discussions.noDiscussions') }}
          </div>
          <discussion-card
            v-for="(item, i) in discussions"
            :key="i"
            :item="item"
          />
        </div>
      </div>
      <base-pager
        v-if="totalPages > 1"
        v-model="page"
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
      page: 1,
      perPager: 8,
      discussionObjects: {},
    };
  },
  computed: {
    ...mapGetters({
      discussions: 'discussions/getDiscussions',
    }),
    totalPages() {
      if (this.discussionObjects.discussions) {
        return Math.ceil(this.discussionObjects.count / this.perPager);
      }
      return 0;
    },
  },
  watch: {
    async page() {
      this.SetLoader(true);
      let payload = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}`;
      payload += this.search.trim().length ? `&q=${this.search}` : '';
      await this.getDiscussions(payload);
      this.SetLoader(false);
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.getDiscussions();
    this.SetLoader(false);
  },
  methods: {
    async discussionFilter() {
      this.SetLoader(true);
      let payload = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}`;
      payload = this.search.trim().length ? `&q=${this.search}` : '';
      await this.getDiscussions(payload);
      this.SetLoader(false);
    },
    async getDiscussions(payload) {
      this.discussionObjects = await this.$store.dispatch('discussions/getDiscussions', payload);
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
    &__title {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    margin-right: auto;
    padding: 30px 0 30px 0;
    }
    &__field {
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
      margin: 0 0 30px 0;
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
    &__pagination {
      margin-top: 5px;
    }
}
</style>
