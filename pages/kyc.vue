<template>
  <div class="kyc">
    <div class="kyc__body">
      <div class="kyc__header">
        {{ $t('kyc.KYC') }}
      </div>
      <div class="kyc__content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'KYC',
};
</script>

<style lang="scss" scoped>
.kyc {
  @include main;
  @include text-simple;
  &__body {
    max-width: 1180px;
    height: 100%;
  }
  &__header {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
    margin: 30px 0 20px;
  }
  &__content {
    height: calc(100% - 86px);
    background: #FFFFFF;
    border-radius: 6px;
  }
}
</style>
