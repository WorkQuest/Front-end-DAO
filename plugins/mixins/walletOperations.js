import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { ERC20 } from '~/abi';
import modals from '~/store/modals/modals';
import { Chains, TokenSymbols } from '~/utils/enums';

export default {
  computed: {
    ...mapGetters({
      selectedNetwork: 'wallet/getSelectedNetwork',
    }),
  },
  methods: {
    /**
     * Check allowance and making approve
     * @param tokenAddress - token
     * @param contractAddress - recipient
     * @param amount - token amount
     * @param approveTitle - title for modal
     * @param decimals - approve token decimals
     * @param symbol - approve token symbol
     * @param nativeTokenSymbol - true -> WQT/ETH etc.
     * @param isHexUserWalletAddress - display from address as hex address
     * @returns {Promise<unknown>}
     * @constructor
     */
    async MakeApprove({
      tokenAddress, contractAddress, amount,
      approveTitle = this.$t('meta.approve'),
      decimals = 18,
      symbol = TokenSymbols.WUSD,
      nativeTokenSymbol = TokenSymbols.WQT,
      isHexUserWalletAddress,
    }) {
      return new Promise(async (resolve, reject) => {
        const allowance = await this.$store.dispatch('wallet/getAllowance', {
          tokenAddress,
          spenderAddress: contractAddress,
          decimals: +decimals,
        });

        if (new BigNumber(allowance).isLessThan(amount)) {
          const needApprove = new BigNumber(allowance).isZero(); // or need increaseAllowance
          const [txFee] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              method: needApprove ? 'approve' : 'increaseAllowance',
              abi: ERC20,
              contractAddress: tokenAddress,
              data: [contractAddress, new BigNumber(amount).shiftedBy(Number(decimals)).toFixed(0).toString()],
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);

          this.SetLoader(false);
          if (!txFee.ok) {
            this.ShowToast(txFee.msg);
            reject();
            return;
          }

          this.ShowModal({
            key: modals.transactionReceipt,
            title: approveTitle,
            fields: {
              from: {
                name: this.$t('modals.fromAddress'),
                value: isHexUserWalletAddress ? this.userWalletAddress : this.ConvertToBech32('wq', this.userWalletAddress),
              },
              to: { name: this.$t('modals.toAddress'), value: contractAddress },
              amount: { name: this.$t('modals.amount'), value: amount, symbol },
              fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: nativeTokenSymbol },
            },
            submitMethod: async () => {
              this.ShowToast('Approving...', 'Approve');
              const approveOk = await this.$store.dispatch('wallet/approve', {
                tokenAddress,
                spenderAddress: contractAddress,
                amount,
                decimals: +decimals,
              });
              if (!approveOk) {
                this.ShowToast('Approve error');
                reject();
                return;
              }
              this.ShowToast('Approving done', 'Approve');
              await resolve(amount);
            },
            cancelMethod: async () => {
              await this.$store.dispatch('wallet/connectToProvider', Chains.WORKNET);
              await reject(new Error('User rejected transaction'));
            },
          });
        } else await resolve(amount);
      });
    },
  },
};
