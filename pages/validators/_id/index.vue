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
              <div class="left__data">
                {{ validatorAddress }}
              </div>
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
                <div class="left__data">
                  {{ item.desc }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="validator__profile profile">
          <div class="profile__right">
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
                :disabled="disabledUndelegate"
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
import converter from 'bech32-converting';
import {
  DelegateMode, ExplorerUrl, TokenSymbols,
} from '~/utils/enums';
import modals from '~/store/modals/modals';
import { error, success } from '~/utils/success-error';
import { CreateSignedTxForValidator, getAddressFromConsensusPub } from '~/utils/wallet';
import { GateGasPrice, ValidatorsMethods, ValidatorsGasLimit } from '~/utils/constants/validators';

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
    disabledUndelegate() {
      return !this.delegatedData || new BigNumber(this.delegatedData?.amount).isZero();
    },
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
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async beforeMount() {
    if (!this.isWalletConnected) return;
    this.SetLoader(true);
    const { id: validatorAddress } = this.$route.params;
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
    this.SetLoader(false);
    if (slotsRes.ok) this.slots = slotsRes.result;
    if (missedBlocksRes.ok) this.missedBlocks = missedBlocksRes.result;
    this.validatorAddress = validatorAddress;
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
      if (!res.ok || !res.result) {
        this.delegatedData = null;
        return;
      }
      this.delegatedData = {
        amount: res.result.delegation_response?.balance?.amount,
        shares: res.result.delegation_response?.delegation?.shares,
      };
    },
    toNotFound() {
      this.notFounded = true;
      this.SetLoader(false);
    },

    getNumbersFromString(str, divider) {
      const arr = str?.split(divider);
      return {
        first: arr[0]?.replace(/[^0-9]/g, ''),
        second: arr[1]?.replace(/[^0-9]/g, ''),
      };
    },

    /** VALIDATORS DELEGATE */

    async toDelegateModal() {
      // calculating possible delegate value
      this.SetLoader(true);
      await this.$store.dispatch('wallet/getBalance');
      const possibleTx = await CreateSignedTxForValidator(
        ValidatorsMethods.DELEGATE,
        this.validatorData.operator_address,
        new BigNumber(this.validatorData?.min_self_delegation || 1).shiftedBy(18).toString(),
      );
      const simulateFeeRes = await this.$store.dispatch('validators/simulate', { signedTxBytes: possibleTx.result });
      this.SetLoader(false);

      if (!simulateFeeRes.result) {
        let { msg } = simulateFeeRes;
        const isSequenceErr = msg?.includes('account sequence mismatch');
        const isAccountErr = msg?.includes('account number');
        if (msg && !isSequenceErr && !isAccountErr && simulateFeeRes?.code === 3 && msg?.includes('awqt')) {
          const { first, second } = this.getNumbersFromString(msg, 'awqt');
          const balance = first ? new BigNumber(first).shiftedBy(-18).toString() : 0;
          const minBalanceToDelegate = second ? new BigNumber(second).shiftedBy(-18).plus(1).toString() : 0;

          msg = this.$t('validators.balanceLessPossible', { balance, min: minBalanceToDelegate, s: TokenSymbols.WQT });
        }
        this.ShowToast(msg, 'Delegate error');
        this.CloseModal();
        return;
      }
      let { gas_used } = simulateFeeRes.gas_info;

      // Max fee for send tx
      const maxFeeValue = new BigNumber(gas_used > ValidatorsGasLimit ? gas_used : ValidatorsGasLimit).multipliedBy(GateGasPrice).shiftedBy(-18);
      let maxValue = new BigNumber(this.balanceData.WQT.fullBalance).minus(maxFeeValue);
      if (maxValue.isLessThan(0)) {
        maxValue = '0';
      } else maxValue = maxValue.toString();

      // Opening Delegate modal
      this.ShowModal({
        key: modals.delegate,
        delegateMode: DelegateMode.VALIDATORS,
        unbondingDays: this.unbondingDays,
        investorAddress: this.ConvertToHex('wqvaloper', this.validatorData.operator_address),
        validatorAddress: this.validatorData.operator_address,
        min: this.validatorData.min_self_delegation,
        maxFee: maxFeeValue,
        submitMethod: async (amount) => {
          this.SetLoader(true);

          // tx for calc gas used
          const gasUsedTx = await CreateSignedTxForValidator(
            ValidatorsMethods.DELEGATE,
            this.validatorData.operator_address,
            new BigNumber(amount).shiftedBy(18).toString(),
          );
          const [simulateRes] = await Promise.all([
            this.$store.dispatch('validators/simulate', { signedTxBytes: gasUsedTx.result }),
            this.$store.dispatch('wallet/getBalance'),
          ]);
          this.SetLoader(false);
          if (!simulateRes.result) {
            this.ShowToast(simulateRes.msg, 'Delegate error');
            this.CloseModal();
            return;
          }
          gas_used = simulateRes.gas_info.gas_used;
          const resultingGasLimit = new BigNumber(gas_used > ValidatorsGasLimit ? gas_used : ValidatorsGasLimit);
          const feeValue = resultingGasLimit.multipliedBy(GateGasPrice).shiftedBy(-18).toString();

          // Transaction receipt
          this.ShowModal({
            key: modals.transactionReceipt,
            title: this.$t('modals.delegate'),
            isShowSuccess: true,
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: this.ConvertToBech32('wq', this.userWalletAddress) },
              to: { name: this.$t('modals.toAddress'), value: this.validatorAddress },
              amount: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WQT },
              fee: {
                name: this.$t('wallet.table.trxFee'),
                value: feeValue,
                symbol: TokenSymbols.WQT,
              },
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
                resultingGasLimit.toString(),
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

    /** VALIDATORS UNDELEGATE */

    async toUndelegateModal() {
      if (this.disabledUndelegate || !this.delegatedData) return;
      this.SetLoader(true);
      const possibleTx = await CreateSignedTxForValidator(
        ValidatorsMethods.UNDELEGATE,
        this.validatorData.operator_address,
        this.delegatedData?.amount,
      );

      // const valconsValidatorAddress = converter('wqvalcons').toBech32(getAddressFromConsensusPub(this.validatorData.consensus_pubkey.key));
      const [possibleRes, rewardsRes] = await Promise.all([
        this.$store.dispatch('validators/simulate', { signedTxBytes: possibleTx.result }),
        this.$store.dispatch('validators/getRewardsForValidator', {
          validatorAddress: this.validatorAddress,
          userWalletAddress: this.ConvertToBech32('wq', this.userWalletAddress),
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);

      const reward = new BigNumber(rewardsRes?.result?.rewards[0]?.amount).shiftedBy(-18).toString();

      this.SetLoader(false);
      if (!possibleRes.result) {
        let msg = possibleRes?.msg;
        if (msg && msg?.includes('awqt')) {
          const { first, second } = this.getNumbersFromString(msg, 'awqt');
          const balance = first ? new BigNumber(first).shiftedBy(-18).toString() : 0;
          const minBalanceToUndelegate = second ? new BigNumber(second).shiftedBy(-18).toString() : 0;

          msg = this.$t('validators.balanceLessPossibleUndelegate', {
            balance,
            min: minBalanceToUndelegate,
            s: TokenSymbols.WQT,
          });
        }
        this.ShowToast(msg, 'Undelegate error');
        this.CloseModal();
        return;
      }

      this.ShowModal({
        key: modals.undelegate,
        title: this.$t('modals.undelegate'),
        delegateMode: DelegateMode.VALIDATORS,
        unbondingDays: this.unbondingDays,
        tokensAmount: this.delegatedData?.amount,
        reward,
        submitMethod: async () => {
          this.SetLoader(true);
          const gasUsedTx = await CreateSignedTxForValidator(
            ValidatorsMethods.UNDELEGATE,
            this.validatorData.operator_address,
            this.delegatedData?.amount,
          );
          const [simulateRes] = await Promise.all([
            this.$store.dispatch('validators/simulate', { signedTxBytes: gasUsedTx.result }),
            this.$store.dispatch('wallet/getBalance'),
          ]);
          this.SetLoader(false);
          if (!simulateRes.result) {
            this.ShowToast(simulateRes.msg, 'Undelegate error');
            this.CloseModal();
            return;
          }
          const { gas_used } = simulateRes.gas_info;
          const resultingGasLimit = new BigNumber(gas_used > ValidatorsGasLimit ? gas_used : ValidatorsGasLimit);

          this.ShowModal({
            key: modals.transactionReceipt,
            isShowSuccess: true,
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: this.ConvertToBech32('wq', this.userWalletAddress) },
              to: { name: this.$t('modals.toAddress'), value: this.validatorAddress },
              fee: {
                name: this.$t('wallet.table.trxFee'),
                value: resultingGasLimit.multipliedBy(GateGasPrice).shiftedBy(-18).toString(),
                symbol: TokenSymbols.WQT,
              },
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
                this.delegatedData?.amount,
                resultingGasLimit.toString(),
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
  &__data {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
    word-break: break-word;
    white-space: pre-line;
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
