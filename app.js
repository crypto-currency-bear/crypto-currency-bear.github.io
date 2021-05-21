const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data () {
    return {
      currentCurrency: { ...this.getInitCryptoCurrency() },
      currenciesToAdd: [ this.getInitCryptoCurrency() ]
    }
  },
  computed: {
    resultCurrency () {
      const totalHoldingQuantity = this.calculateTotalHoldingQuantity()
      const totalBuyingPrice = this.calculateTotalBuyingPrice()

      return {
        buyingPrice: totalBuyingPrice / totalHoldingQuantity,
        totalHoldingQuantity: totalHoldingQuantity,
        totalBuyingPrice: totalBuyingPrice
      }
    }
  },
  mounted () {
    this.focusOnCurrentBuyingPrice()
  },
  methods: {
    onInputBuyingPrice (currency) {
      currency.totalBuyingPrice = currency.buyingPrice && currency.holdingQuantity ? currency.buyingPrice * currency.holdingQuantity : null
    },
    onInputHoldingQuantity (currency, value) {
      currency.holdingQuantity = value
      currency.totalBuyingPrice = value ? currency.buyingPrice * currency.holdingQuantity : null
    },
    onInputTotalBuyingPrice (currency, value) {
      currency.totalBuyingPrice = value
      currency.holdingQuantity = value ? currency.totalBuyingPrice / currency.buyingPrice : null
    },
    onClickAddCurrency () {
      this.currenciesToAdd = [{ ...this.getInitCryptoCurrency() }].concat(this.currenciesToAdd)
      this.focusFirstAddedBuyingPrice()
    },
    onClickRemoveCurrency (index) {
      this.currenciesToAdd = this.currenciesToAdd.filter((v, i) => i !== index)
    },
    calculateTotalHoldingQuantity () {
      const currHoldingQuantity = this.parseToInteger(this.currentCurrency.holdingQuantity)
      const addedTotalHoldingQuantity = this.currenciesToAdd.reduce((acc, curr) => acc + this.parseToInteger(curr.holdingQuantity), 0)

      return currHoldingQuantity + addedTotalHoldingQuantity
    },
    calculateTotalBuyingPrice () {
      const currTotalBuyingPrice = this.parseToInteger(this.currentCurrency.totalBuyingPrice)
      const addedTotalBuyingPrice = this.currenciesToAdd.reduce((acc, curr) => acc + this.parseToInteger(curr.totalBuyingPrice), 0)

      return currTotalBuyingPrice + addedTotalBuyingPrice
    },
    getInitCryptoCurrency () {
      return {
        buyingPrice: null,
        holdingQuantity: null,
        totalBuyingPrice: null
      }
    },
    parseToInteger (value) {
      return Number(value) || 0
    },
    focusCurrentBuyingPrice () {
      this.$refs.currentBuyingPrice.focus()
    },
    focusFirstAddedBuyingPrice () {
      this.$refs.addedBuyingPrice[0].focus()
    }
  }
})
