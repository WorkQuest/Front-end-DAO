<template>
  <div class="main__body">
    <div class="nav_block">
      <ul class="nav">
        <li class="nav-item">
          <button
            class="nav-btn nav-btn_prev"
            @click="prevTab()"
          >
            <div
              class="nav-arrow"
              :disabled="tab === 1"
              :class="tab === 1 ? 'nav-arrow_disabled' : 'nav-arrow_active'"
            />
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 1}]"
            @click="tab = 1"
          >
            1
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 2}]"
            @click="tab = 2"
          >
            2
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 3}]"
            @click="tab = 3"
          >
            3
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 4}]"
            @click="tab = 4"
          >
            4
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 5}]"
            @click="tab = 5"
          >
            5
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn nav-btn_next"
            :disabled="tab === 5"
            @click="nextTab()"
          >
            <div
              class="nav-arrow"
              :class="tab === 5 ? 'nav-arrow_disabled' : 'nav-arrow_active'"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  data() {
    return {
      tab: 1,
      currentPage: 1,
      search: '',
    };
  },
  computed: {
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    prevTab() {
      if (this.tab > 1) {
        this.tab -= 1;
      }
    },
    nextTab() {
      this.tab += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.nav_block {
  background-color: #FFFFFF;
  display: flex;
  justify-content: flex-end;
  border-radius: 6px;
  width: max-content;
  margin-top: 25px;
  float: right;
  .nav {
    align-content: center;
    &-btn {
      border-left: 1px solid #F7F8FA;
      width:43px;
      height:43px;
      &__active {
        background-color: #E6F3F9;
        color: #0083c7;
      }
      &_next .nav-arrow{
        mask-image: url('assets/img/ui/coolicon_next.svg');
      }

      &_prev .nav-arrow {
        mask-image: url('assets/img/ui/coolicon_prev.svg');
      }
    }
    &-arrow {
      margin-left: auto;
      margin-right: auto;
      height: 10px;
      width: 5px;
      &_disabled {
        background-color: #c2c2c2;
      }
      &_active {
        background-color: #4C5767;
      }
    }
  }
}
</style>
