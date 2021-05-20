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
      const totalHoldingQuantity = this.computeTotalHoldingQuantity()
      const totalBuyingPrice = this.computeTotalBuyingPrice()

      return {
        buyingPrice: totalBuyingPrice / totalHoldingQuantity,
        totalHoldingQuantity: totalHoldingQuantity,
        totalBuyingPrice: totalBuyingPrice
      }
    }
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
      this.currenciesToAdd = this.currenciesToAdd.concat([{ ...this.getInitCryptoCurrency() }])
    },
    onClickRemoveCurrency (index) {
      this.currenciesToAdd = this.currenciesToAdd.filter((v, i) => i !== index)
    },
    computeTotalHoldingQuantity () {
      const currHoldingQuantity = this.parseToInteger(this.currentCurrency.holdingQuantity)
      const addedTotalHoldingQuantity = this.currenciesToAdd.reduce((acc, curr) => acc + this.parseToInteger(curr.holdingQuantity), 0)

      return currHoldingQuantity + addedTotalHoldingQuantity
    },
    computeTotalBuyingPrice () {
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
      const parsed = Number(value)

      return parsed === NaN ? 0 : parsed
    }
  }
})
