<template>
  <div class="delegations">
    <!--
    <template v-if="!isEmptyHistory">
      <div class="delegations__data data">
        <div
          class="data__header data__grid"
          :style="columnsStyle"
        >
          <div
            v-for="(item, i) of fields"
            :key="i"
            class="data__field"
          >
            {{ item.label }}
          </div>
          <div
            v-for="(item, i) of items"
            :key="i"
            class="data__item"
          >
            &lt;!&ndash;            <img&ndash;&gt;
            &lt;!&ndash;              v-if="item.avatar !== undefined"&ndash;&gt;
            &lt;!&ndash;              :src="item.avatar ? item.avatar : $options.images.AVATAR_EMPTY"&ndash;&gt;
            &lt;!&ndash;              class="data__avatar"&ndash;&gt;
            &lt;!&ndash;            >&ndash;&gt;
            &lt;!&ndash;            <a&ndash;&gt;
            &lt;!&ndash;              v-if="item.link"&ndash;&gt;
            &lt;!&ndash;              :href="item.link"&ndash;&gt;
            &lt;!&ndash;              class="link"&ndash;&gt;
            &lt;!&ndash;            >&ndash;&gt;
            &lt;!&ndash;              {{ item.value }}&ndash;&gt;
            &lt;!&ndash;            </a>&ndash;&gt;
            &lt;!&ndash;            <template v-else>&ndash;&gt;
            &lt;!&ndash;              {{ item.value }}&ndash;&gt;
            &lt;!&ndash;            </template>&ndash;&gt;
            &lt;!&ndash;            <button-copy&ndash;&gt;
            &lt;!&ndash;              v-if="item.toCopyText"&ndash;&gt;
            &lt;!&ndash;              :copy-value="item.toCopyText"&ndash;&gt;
            &lt;!&ndash;            />&ndash;&gt;

            &lt;!&ndash;            <div class="data__sub-field sub-field">&ndash;&gt;
            &lt;!&ndash;              sub info&ndash;&gt;
            &lt;!&ndash;            </div>&ndash;&gt;
          </div>
        </div>
        <div
          class="data__rows data__grid"
          :style="columnsStyle"
        />
      </div>
    </template>
    <template v-else>
      <empty-data
        class="delegations__empty"
        description="List is empty"
      />
    </template>
    <base-pager
      :total-pages="totalPages"
      class="delegations__pager"
    />-->

    <b-table
      :items="items"
      :fields="fields"
      show-empty
      borderless
      caption-top
      thead-class="table__header"
      :responsive="true"
      tbody-tr-class="table__row"
    >
      <template #table-caption>
        <span class="delegations__title">Delegation</span>
      </template>
      <template #cell(username)="el">
        <img
          :src="el.item.avatar || $options.images.AVATAR_EMPTY"
          class="avatar"
        >
        <span class="table__grey">{{ el.item.username }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
import { images } from '~/utils/images';

export default {
  name: 'DelegationsTable',
  images,
  data() { // TODO: to all data props
    return {
      isEmptyHistory: false,
      fields: [
        { key: 'username', label: 'Name', sortable: false },
        { key: 'address', label: 'Address', sortable: false },
        { key: 'votingPower', label: 'Voting power', sortable: false },
        { key: 'delegated', label: 'Delegated', sortable: false },
      ],
      items: [
        {
          username: 'user@gmail.com',
          userId: 'userid',
          avatar: '',
          delegated: '1000000 WQT',
        },
      ],

      subFields: [
        { key: 'hash', label: 'Tx Hash' },
        { key: 'date', label: 'Date' },
        { key: 'type', label: 'Type' },
        { key: 'delegated', label: 'Delegated' },
      ],
      subItems: [
        {
          hash: '0x123...123',
          date: 'Feb 1, 2021, 21:34',
          type: '100000 WQT',
          delegated: 'Delegate',
        },
      ],
    };
  },
  computed: {
    columnsStyle() {
      return `grid-template-columns: repeat(${this.fields.length}, 1fr);`;
    },
    totalPages() {
      return 56;
    },
  },
};
</script>

<style scoped lang="scss">
.delegations {
  &__title {
    background: $white;
    padding: 12px 10px;
    font-size: 16px;
    width: 100%;
    line-height: 130%;
  }

  &__pager {
    margin-top: 1rem;
  }
}

.avatar {
   @include avatar;
   margin-right: 10px;
}

.sub-field {
  background: red;
  width: 100%;
}

.link {
  text-decoration: underline;
  cursor: pointer;
  color: $blue;
}
</style>
