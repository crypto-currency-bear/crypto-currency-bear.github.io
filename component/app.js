const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data () {
    return {
      account: { ...this.getInitCryptoCurrency() },
      desiredEntries: [ this.getInitCryptoCurrency() ]
    }
  },
  computed: {
    calculatedAccount () {
      const quantity = this.calculateTotalHoldingQuantity()
      const totalEntryPrice = this.calculateTotalBuyingPrice()

      return {
        entryPrice: totalEntryPrice / quantity,
        quantity: quantity,
        totalEntryPrice: totalEntryPrice
      }
    }
  },
  mounted () {
    this.focusCurrentBuyingPrice()
  },
  methods: {
    onInputPrice (currency) {
      currency.totalEntryPrice = currency.entryPrice && currency.quantity ? currency.entryPrice * currency.quantity : null
    },
    onInputQuantity (currency, value) {
      currency.quantity = value
      currency.totalEntryPrice = value ? currency.entryPrice * currency.quantity : null
    },
    onInputTotalPrice (currency, value) {
      currency.totalEntryPrice = value
      currency.quantity = value ? currency.totalEntryPrice / currency.entryPrice : null
    },
    onClickAddCurrency () {
      this.desiredEntries = [{ ...this.getInitCryptoCurrency() }].concat(this.desiredEntries)
      this.focusFirstAddedBuyingPrice()
    },
    onClickRemoveCurrency (index) {
      this.desiredEntries = this.desiredEntries.filter((v, i) => i !== index)
    },
    calculateTotalHoldingQuantity () {
      const currHoldingQuantity = this.parseToInteger(this.account.quantity)
      const addedTotalHoldingQuantity = this.desiredEntries.reduce((acc, curr) => acc + this.parseToInteger(curr.quantity), 0)

      return currHoldingQuantity + addedTotalHoldingQuantity
    },
    calculateTotalBuyingPrice () {
      const currTotalBuyingPrice = this.parseToInteger(this.account.totalEntryPrice)
      const addedTotalBuyingPrice = this.desiredEntries.reduce((acc, curr) => acc + this.parseToInteger(curr.totalEntryPrice), 0)

      return currTotalBuyingPrice + addedTotalBuyingPrice
    },
    getInitCryptoCurrency () {
      return {
        entryPrice: null,
        quantity: null,
        totalEntryPrice: null
      }
    },
    parseToInteger (value) {
      return Number(value) || 0
    },
    focusCurrentBuyingPrice () {
      this.$refs.accountPrice.focus()
    },
    focusFirstAddedBuyingPrice () {
      this.$refs.desiredFirstEntries[0].focus()
    }
  }
})
