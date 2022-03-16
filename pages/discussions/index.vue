<template>
  <div class="discussions">
    <div class="discussions__title">
      {{ $t('discussions.title') }}
    </div>
    <div class="discussions__header">
      <base-field
        v-model="search"
        class="discussions__search"
        is-hide-error
        is-search
        :placeholder="$t('discussions.seacrhField')"
        mode="icon"
        @input="searchDiscussion"
      />
      <base-btn
        class="discussions__btn"
        @click="openModalAddDiscussion"
      >
        {{ $t('discussions.btn') }}
      </base-btn>
    </div>
    <empty-data
      v-if="discussions.length === 0"
      :description="$t('discussions.noDiscussions')"
    />
    <div class="discussions__cards">
      <discussion-card
        v-for="(item, i) in discussions"
        :key="i"
        :item="item"
        class="discussions__card"
      />
    </div>
    <base-pager
      v-if="totalPages > 1"
      v-model="page"
      class="discussions__pager"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Discussions',
  data() {
    return {
      page: 1,
      limit: 8,
      offset: 0,
      search: '',
    };
  },
  computed: {
    ...mapGetters({
      discussions: 'discussions/getDiscussions',
      discussionsCount: 'discussions/getDiscussionsCount',
    }),
    totalPages() {
      return Math.ceil(this.discussionsCount / this.limit);
    },
  },
  watch: {
    async page() {
      this.SetLoader(true);
      this.offset = (this.page - 1) * this.limit;
      await this.$store.dispatch('discussions/getAllDiscussions', {
        limit: this.limit,
        offset: this.offset,
        q: this.search.trim(),
      });
      this.SetLoader(false);
    },
  },
  mounted() {
    this.SetLoader(true);
    this.$store.dispatch('discussions/getAllDiscussions', {
      limit: this.limit,
      offset: this.offset,
    });
    this.SetLoader(false);
  },
  methods: {
    async searchDiscussion() {
      this.SetLoader(true);
      let timeOut;
      if (timeOut !== undefined) clearTimeout(timeOut);
      timeOut = setTimeout(async () => {
        this.page = 1;
        this.offset = 0;
        await this.$store.dispatch('discussions/getAllDiscussions', {
          limit: this.limit,
          offset: this.offset,
          q: this.search.trim(),
        });
      }, 500);
      this.SetLoader(false);
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

  &__header {
    display: flex;
    justify-content: space-between;
    margin: 0 0 30px 0;
  }

  &__title {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    margin-right: auto;
    padding: 30px 0 30px 0;
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

  &__card {
    min-width: 0;
  }

  &__cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin-bottom: 15px;
  }

  &__btn {
    width: 220px;
    height: 43px;
  }

  &__pager {
    margin-top: 5px;
  }
}

@include _1199 {
  .discussions {
    &__title {
      margin-left: 20px;
      margin-right: 20px;
    }

    &__header {
      margin-left: 20px;
      margin-right: 20px;
    }

    &__cards {
      grid-template-columns: 1fr;
      margin: 20px;
    }
  }
}

@include _991 {
  .discussions {
    max-width: 100vw;

    &__btn {
      margin-left: 10px;
    }
  }
}

@include _767 {
  .discussions {
    &__cards {
      grid-template-columns: 1fr;
    }
  }
}

@include _480 {
  .discussions__btn {
    font-size: 12px;
  }
}
</style>
