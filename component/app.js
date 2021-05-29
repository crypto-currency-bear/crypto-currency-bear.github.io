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
      const quantity = this.calculateTotalQuantity()
      const totalEntryPrice = this.calculateTotalPrice()

      return {
        entryPrice: totalEntryPrice / quantity,
        quantity: quantity,
        totalEntryPrice: totalEntryPrice
      }
    }
  },
  mounted () {
    this.focusAccountEntryPrice()
  },
  methods: {
    onInputPrice (currency) {
      currency.totalEntryPrice = currency.entryPrice || currency.quantity ? currency.entryPrice * currency.quantity : null
    },
    onInputQuantity (currency, value) {
      currency.quantity = value
      currency.totalEntryPrice = value ? currency.entryPrice * currency.quantity : null
    },
    onInputTotalPrice (currency, value) {
      currency.totalEntryPrice = value
      currency.quantity = value ? currency.totalEntryPrice / currency.entryPrice : null
    },
    onClickResetAccount () {
      this.account = { ...this.getInitCryptoCurrency() }
      this.focusAccountEntryPrice()
    },
    onClickResetDesiredEntry (index) {
      this.desiredEntries = this.desiredEntries.map((v, i) => {
        if (i === index) {
          v = { ...this.getInitCryptoCurrency() }
        }

        return v
      })

      this.focusDesiredEntry(index)
    },
    onClickAddDesiredEntry () {
      this.desiredEntries = [{ ...this.getInitCryptoCurrency() }].concat(this.desiredEntries)

      this.focusDesiredEntry(0)
    },
    onClickRemoveDesiredEntry (index) {
      this.desiredEntries = this.desiredEntries.filter((v, i) => i !== index)
    },
    calculateTotalQuantity () {
      const accountQuantity = this.parseToInteger(this.account.quantity)
      const totalDesiredQuantity = this.desiredEntries.reduce((acc, curr) => acc + this.parseToInteger(curr.quantity), 0)

      return accountQuantity + totalDesiredQuantity
    },
    calculateTotalPrice () {
      const accountEntryPrice = this.parseToInteger(this.account.totalEntryPrice)
      const desiredTotalEntryPrice = this.desiredEntries.reduce((acc, curr) => acc + this.parseToInteger(curr.totalEntryPrice), 0)

      return accountEntryPrice + desiredTotalEntryPrice
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
    focusAccountEntryPrice () {
      this.$refs.accountPrice.focus()
    },
    focusDesiredEntry (index) {
      this.$refs.desiredFirstEntries[index].focus()
    }
  }
})
