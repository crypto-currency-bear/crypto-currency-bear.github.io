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
      const totalHoldingQuantity = Number(this.currentCurrency.holdingQuantity) + this.currenciesToAdd.reduce((acc, curr) => acc + Number(curr.holdingQuantity), 0)
      const totalBuyingPrice = Number(this.currentCurrency.totalBuyingPrice) + this.currenciesToAdd.reduce((acc, curr) => acc + Number(curr.totalBuyingPrice), 0)

      return {
          buyingPrice: totalBuyingPrice / totalHoldingQuantity,
          totalHoldingQuantity: totalHoldingQuantity,
          totalBuyingPrice: totalBuyingPrice
        }
      }
  },
  methods: {
    onInputBuyingPrice (currency) {
      currency.totalBuyingPrice = currency.buyingPrice ? currency.buyingPrice * currency.holdingQuantity : null
    },
    onInputHoldingQuantity (currency, value) {
      currency.holdingQuantity = value
      currency.totalBuyingPrice = value ? currency.buyingPrice * currency.holdingQuantity : null
    },
    onInputTotalBuyingPrice (currency, value) {
      currency.totalBuyingPrice = value
      currency.holdingQuantity = value ? currency.totalBuyingPrice / currency.buyingPrice : null
    },
    getInitCryptoCurrency () {
      return {
        buyingPrice: null,
        holdingQuantity: null,
        totalBuyingPrice: null
      }
    }
  }
})
