<template>
  <div class="validator">
    <div class="validator__body">
      <div class="validator__head">
        <div class="validator__back back">
          <nuxt-link
            class="back__link"
            to="/validators"
          >
            <span class="back__icon icon-short_left" />
            {{ $t('proposal.back') }}
          </nuxt-link>
        </div>
        <div class="validator__title">
          {{ $t('validator.title') }}
        </div>
      </div>
      <empty-data
        v-if="notFounded"
        :description="$t('validators.notFounded')"
      />
      <div
        v-else
        class="validator__block"
      >
        <div class="validator__profile profile">
          <div class="profile__left">
            <img
              class="profile__avatar"
              :src="require('~/assets/img/app/avatar_empty.png')"
              alt="empty avatar"
            >
            <div class="left__info">
              <div
                v-if="validatorData"
                class="left__user"
              >
                <div class="left__text left__text_name">
                  {{ validatorData.description.moniker }}
                </div>
                <div class="left__date">
                  {{ $t('validators.createdAt', { date: $moment(validatorData.commission.update_time).format('LLL') }) }}
                </div>
              </div>
            </div>
          </div>
          <div class="profile__left profile__left_data">
            <div class="left__user">
              <div class="left__text">
                {{ $t('modals.address') }}
              </div>
              <a
                :href="explorerAddressUrl"
                target="_blank"
                class="left__date"
              >
                {{ CutTxn(convertedValidatorAddress, 6, 6) }}
              </a>
            </div>
            <div
              v-for="(item, key) in leftColumn"
              :key="key"
              class="left__info"
            >
              <div class="left__user">
                <div class="left__text">
                  {{ item.name }}
                </div>
                <div class="left__date">
                  {{ item.desc }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="validator__profile profile">
          <div class="profile__right">
            <div class="right__bar">
              <div class="bar__info">
                <div class="bar__text">
                  {{ $t('validator.slots') }}
                </div>
                <div class="bar__data">
                  <div class="bar__text bar__text_grey">
                    {{ `${$t('validator.occupied')}:` }}
                  </div>
                  <div class="bar__text bar__text_small">
                    {{ `${slots} ${$t('validator.outOf')} 1000` }}
                  </div>
                </div>
              </div>
              <progress-bar
                :value="slots / 10"
                mode="blue"
              />
            </div>
            <div class="right__block">
              <div class="right__info">
                <div class="right__data-name">
                  {{ $t('validator.delegators') }}
                </div>
                <div class="right__data-desc">
                  {{ slots }}
                </div>
              </div>
              <div class="right__info">
                <div class="right__data-name">
                  {{ $t('validator.minimalStake') }}
                </div>
                <div class="right__data-desc">
                  {{ $tc('meta.wqtCount', validatorData ? validatorData.min_self_delegation : '') }}
                </div>
              </div>
            </div>
            <div class="right__block">
              <base-btn
                mode="lightRed"
                class="right__button"
                :disabled="!delegatedData"
                @click="toUndelegateModal"
              >
                {{ $t('modals.undelegate') }}
              </base-btn>
              <base-btn
                mode="lightBlue"
                class="right__button"
                @click="toDelegateModal"
              >
                {{ $t('modals.delegate') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  DelegateMode, ExplorerUrl, TokenSymbols, ValidatorsMethods,
} from '~/utils/enums';
import modals from '~/store/modals/modals';
import { error, success } from '~/utils/success-error';
import { CreateSignedTxForValidator } from '~/utils/wallet';

export default {
  name: 'Validator',
  data() {
    return {
      notFounded: false,
      slots: 0,
      missedBlocks: 0,
      delegatedData: null,
      validatorAddress: null,
    };
  },
  computed: {
    ...mapGetters({
      balanceData: 'wallet/getBalanceData',
      stakingParams: 'validators/getStakingParams',
      validatorData: 'validators/getValidatorData',
      validatorsList: 'validators/getValidatorsList',
      userWalletAddress: 'user/getUserWalletAddress',
      isWalletConnected: 'wallet/getIsWalletConnected',
    }),
    unbondingDays() {
      // Через N дней юзеру вернутся WQT после undelegate
      return Number(this.stakingParams.unbonding_time.slice(0, -1)) / 60 / 60 / 24;
    },
    leftColumn() {
      const stake = this.validatorData?.tokens
        ? new BigNumber(this.validatorData.tokens).shiftedBy(-this.balanceData.WQT.decimals).toString() : 0;
      const res = [
        { name: this.$t('validator.commonStake'), desc: this.$tc('meta.wqtCount', stake) },
        { name: this.$t('validator.fee'), desc: `${Math.ceil(this.validatorData?.commission?.commission_rates?.rate * 100)}%` },
        { name: this.$t('validator.missedBlocks'), desc: this.missedBlocks },
      ];
      if (this.validatorData?.jailed) {
        res.push({ name: this.$t('validators.table.status'), desc: this.$t('validators.jailed') });
      }
      return res;
    },
    convertedValidatorAddress() {
      if (!this.validatorData) return '';
      return this.ConvertToBech32('wq', this.ConvertToHex('wqvaloper', this.validatorData.operator_address));
    },
    explorerAddressUrl() {
      return `${ExplorerUrl}/address/${this.convertedValidatorAddress}`;
    },
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async beforeMount() {
    if (!this.isWalletConnected) return;
    this.SetLoader(true);
    const { id } = this.$route.params;
    let validatorAddress = null;
    try {
      validatorAddress = this.ConvertToHex('wq', id);
      validatorAddress = this.ConvertToBech32('wqvaloper', validatorAddress);
      // eslint-disable-next-line no-empty
    } catch (e) {
      this.toNotFound();
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.validatorsList) {
      if (item.operator_address === validatorAddress) {
        this.$store.commit('validators/setValidatorData', item);
      }
    }
    if (!this.validatorData) {
      const res = await this.$store.dispatch('validators/getValidatorByAddress', validatorAddress);
      if (!res.ok) this.toNotFound();
    }

    const [slotsRes, missedBlocksRes] = await Promise.all([
      this.$store.dispatch('validators/getSlotsCount', validatorAddress),
      this.$store.dispatch('validators/getMissedBlocks', this.validatorData.consensus_pubkey.key),
      this.$store.dispatch('validators/getStakingParams'),
      this.updateDelegatedAmount(),
    ]);
    if (slotsRes.ok) this.slots = slotsRes.result;
    if (missedBlocksRes.ok) this.missedBlocks = missedBlocksRes.result;
    this.validatorAddress = validatorAddress;
    this.SetLoader(false);
  },
  beforeDestroy() {
    this.$store.commit('validators/setValidatorData', null);
  },
  methods: {
    async updateDelegatedAmount() {
      // Данные о делегировании с аккаунта юзера этому валидатору
      const res = await this.$store.dispatch('validators/getDelegatedDataForValidator', {
        userWalletAddress: this.ConvertToBech32('wq', this.userWalletAddress),
        validatorAddress: this.validatorData.operator_address,
      });
      if (!res.ok) {
        this.delegatedData = null;
        return;
      }
      this.delegatedData = {
        amount: res.result.delegation_response.balance.amount,
        shares: res.result.delegation_response.delegation.shares,
      };
    },
    toNotFound() {
      this.notFounded = true;
      this.SetLoader(false);
    },
    async toDelegateModal() {
      this.ShowModal({
        key: modals.delegate,
        delegateMode: DelegateMode.VALIDATORS,
        unbondingDays: this.unbondingDays,
        investorAddress: this.ConvertToHex('wqvaloper', this.validatorData.operator_address),
        min: this.validatorData.min_self_delegation,
        submitMethod: async (amount) => {
          this.SetLoader(true);
          const gasUsedTx = await CreateSignedTxForValidator(
            ValidatorsMethods.DELEGATE,
            this.validatorData.operator_address,
            new BigNumber(amount).shiftedBy(18).toString(),
          );
          const simulateRes = await this.$store.dispatch('validators/simulate', { signedTxBytes: gasUsedTx.result });
          const { gas_used } = simulateRes.gas_info;
          this.SetLoader(false);
          this.ShowModal({
            key: modals.transactionReceipt,
            title: this.$t('modals.delegate'),
            isShowSuccess: true,
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: this.ConvertToBech32('wq', this.userWalletAddress) },
              to: { name: this.$t('modals.toAddress'), value: this.convertedValidatorAddress },
              amount: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WQT },
              gasLimit: { name: this.$t('modals.gasLimit'), value: gas_used },
            },
            callback: async () => await new Promise((resolve) => {
              setTimeout(async () => {
                await Promise.all([
                  this.$store.dispatch('validators/getSlotsCount', this.validatorAddress),
                  this.$store.dispatch('validators/getValidatorByAddress', this.validatorAddress),
                  this.updateDelegatedAmount(),
                ]);
                resolve();
              }, 7000);
            }),
            submitMethod: async () => {
              const delegateTx = await CreateSignedTxForValidator(
                ValidatorsMethods.DELEGATE,
                this.validatorData.operator_address,
                new BigNumber(amount).shiftedBy(18).toString(),
                gas_used,
              );
              const broadcastRes = await this.$store.dispatch('validators/broadcast', { signedTxBytes: delegateTx.result });
              if (broadcastRes.tx_response.raw_log !== '[]') {
                this.ShowToast(broadcastRes.tx_response.raw_log);
                return error();
              }
              return success();
            },
          });
        },
      });
    },
    toUndelegateModal() {
      this.ShowModal({
        key: modals.undelegate,
        title: this.$t('modals.undelegate'),
        delegateMode: DelegateMode.VALIDATORS,
        unbondingDays: this.unbondingDays,
        tokensAmount: this.delegatedData.amount,
        submitMethod: async () => {
          this.SetLoader(true);
          const gasUsedTx = await CreateSignedTxForValidator(
            ValidatorsMethods.UNDELEGATE,
            this.validatorData.operator_address,
            this.delegatedData.amount,
          );
          const simulateRes = await this.$store.dispatch('validators/simulate', { signedTxBytes: gasUsedTx.result });
          const { gas_used } = simulateRes.gas_info;
          this.SetLoader(false);
          this.ShowModal({
            key: modals.transactionReceipt,
            isShowSuccess: true,
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: this.ConvertToBech32('wq', this.userWalletAddress) },
              to: { name: this.$t('modals.toAddress'), value: this.convertedValidatorAddress },
              gasLimit: { name: this.$t('modals.gasLimit'), value: gas_used },
            },
            callback: async () => await new Promise((resolve) => {
              setTimeout(async () => {
                await Promise.all([
                  this.$store.dispatch('validators/getSlotsCount', this.validatorAddress),
                  this.$store.dispatch('validators/getValidatorByAddress', this.validatorAddress),
                  this.updateDelegatedAmount(),
                ]);
                resolve();
              }, 7000);
            }),
            submitMethod: async () => {
              const undelegateTx = await CreateSignedTxForValidator(
                ValidatorsMethods.UNDELEGATE,
                this.validatorData.operator_address,
                this.delegatedData.amount,
                gas_used,
              );
              const broadcastRes = await this.$store.dispatch('validators/broadcast', { signedTxBytes: undelegateTx.result });
              if (broadcastRes.tx_response.raw_log !== '[]') {
                this.ShowToast(broadcastRes.tx_response.raw_log);
                return error();
              }
              return success();
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.validator {
  @include main;
  @include text-simple;
  &__body {
    margin-top: 30px;
    display: grid;
    grid-template-rows: 80px auto;
    grid-gap: 20px;
  }
  &__back {
    width: 77px;
    height: 24px;
  }
  &__block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  &__title{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
  }
  &__profile {
    grid-gap: 20px;
    display: grid;
    height: fit-content;
    padding: 20px;
    border-radius: 6px;
    background: white;
  }
}

.back {
  &__link {
    font-weight: 500;
    font-size: 18px;
    line-height: 130%;
    color: $black600;
  }
  &__link:hover {
    text-decoration: none;
  }
  &__icon {
    color: $black600;
  }
}

.profile {
  &__left {
    display: grid;
    grid-template-columns: 76px auto;
    grid-gap: 20px;
    align-items: center;
    &_data {
      grid-template-columns: auto auto;
    }
  }
  &__right {
    display: grid;
    grid-gap: 20px;
  }
  &__avatar {
    width: 100%;
  }
}

.left {
  &__text {
    font-weight: 600;
    font-size: 18px;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    &_name {
      font-weight: 500;
    }
  }
  &__date {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
  }
}

.right {
  &__button, &__info, &__bar {
    border: 1px solid $black0;
    box-sizing: border-box;
    border-radius: 6px;
    &_red {
      color: $red;
      border-color: $red100;
    }
    &_blue {
      color: $blue;
      border-color: $blue100;
    }
  }
  &__button {
    min-height: 40px;
  }
  &__bar {
    display: grid;
    grid-gap: 10px;
  }
  &__info {
    display:flex;
    flex-direction: column;
    padding: 10px;
    justify-content: space-around;
  }
  &__data-name {
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
  }
  &__data-desc {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: $blue;
  }
  &__block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
  &__bar {
    padding: 20px 10px;
  }
}

.bar {
  &__info {
    display: flex;
    justify-content: space-between;
  }
  &__text {
    font-weight: 600;
    font-size: 18px;
    &_small {
      font-weight: 500;
      font-size: 16px;
    }
    &_grey {
      font-weight: 500;
      font-size: 16px;
      color: $black400;
    }
  }
  &__data {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 5px;
  }
}

@include _1199 {
  .validator {
    &__body {
      padding: 0 20px;
    }
    &__block {
      grid-template-columns: auto;
      grid-template-rows: repeat(2, 290px);
    }
  }
}

@include _767 {
  .left {
    &__text {
      &_name {
        width: calc(100vw - 180px);
      }
    }
  }
  .validator {
    &__profile {
      max-height: none;
    }
    &__block {
      display: flex;
      flex-direction: column;
    }
  }
  .right__block {
    grid-template-columns: 1fr;
  }
}

@include _480 {
  .validator {
    &__profile {
      max-height: 100%;
    }
    &__block {
      grid-template-columns: auto;
      grid-template-rows: repeat(2, 340px);
    }
  }
  .profile__left_data {
    grid-template-columns: 1fr;
  }
  .bar {
    &__data {
      grid-template-columns: auto;
    }
  }
}
</style>
