<template>
  <div>
    1
  </div>
</template>

<script>
export default {
  name: 'Index',
};
</script>

<style lang="scss" scoped>
.page {
  &__grid {
     display: grid;
     grid-template-columns: repeat(2, 1fr);
   }
  &__title {
     margin: 20px 0 20px 0;
     font-weight: 500;
     font-size: 25px;
     color: $black800;
   }
  &__profile {
     @include main-white;
     justify-content: flex-start;
     border-radius: 6px;
     margin: 20px 0 20px 0;
     display: inherit;
   }
  &__checkbox {
     margin: 50px 0 20px 20px;
     display: flex;
     flex-direction: row;
  }
  &__part {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    &_left {
      display: grid;
    }
    &_right {
      display: grid;
    }
  }
  &__info {
    background-color: #0083C7;
    border-radius: 6px;
    color: $white;
    max-height: 207px;
    &-title {
      margin: 20px 0 0 20px;
      font-size: 25px;
      font-weight: 500;
    }
    &-subtitle {
      margin: 10px 0 0 20px;
      font-size: 16px;
      font-weight: 400;
    }
  }
  &__badge {
     background: rgba(0, 131, 199, 0.1);
     border-radius: 44px;
     margin: 10px;
     color: $blue;
     padding: 5px 6px;
     display: flex;
     text-align: center;
    &-skills {
      padding: 15px;
    }
  }
  &__skills {
     flex-direction: row;
     flex-wrap: wrap;
     display: flex;
     max-width: 1180px;
     width: 100%;
     justify-content: flex-start;
   //padding: 0 20px 0 0;
  }
}
</style>
