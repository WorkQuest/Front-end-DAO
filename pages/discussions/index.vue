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
      <base-pager
        v-model="pages"
        class="discussions__pagination"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<script>

import modals from '~/store/modals/modals';

export default {

  data() {
    return {
      search: '',
      pages: 1,
      totalPages: 5,
      discussions: [
        {
          id: 1,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 2,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 3,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 4,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 5,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 6,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 7,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 8,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 9,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          id: 10,
          avatar: '~assets/img/ui/avatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
      ],
    };
  },
  methods: {
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
@include _1199 {
  .discussions {
    padding: 15px;
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
    padding: 16px;
    &__card {
      grid-template-columns: 1fr;
    }
  }
}
</style>
