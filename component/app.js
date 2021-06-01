const localStorageKey = {
  account: 'account',
  desiredEntries: 'desiredEntries'
}

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
        entryPrice: this.parseToInteger(totalEntryPrice / quantity),
        quantity: quantity,
        totalEntryPrice: totalEntryPrice
      }
    }
  },
  mounted () {
    this.initialize()
    this.focusAccountEntryPrice()
  },
  methods: {
    onInputPrice (currency) {
      currency.totalEntryPrice = currency.entryPrice || currency.quantity ? currency.entryPrice * currency.quantity : null

      this.saveAll()
    },
    onInputQuantity (currency, value) {
      currency.quantity = value
      currency.totalEntryPrice = value ? currency.entryPrice * currency.quantity : null

      this.saveAll()
    },
    onInputTotalPrice (currency, value) {
      currency.totalEntryPrice = value
      currency.quantity = value ? currency.totalEntryPrice / currency.entryPrice : null

      this.saveAll()
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
    },
    initialize () {
      const localStorageKeys = Object.keys(localStorage)

      if (localStorageKeys.indexOf(localStorageKey.account) > -1) {
        try {
          this.account = JSON.parse(localStorage.getItem(localStorageKey.account))
        } catch (error) {
          localStorage.removeItem(localStorageKey.account)
        }
      }

      if (localStorageKeys.indexOf(localStorageKey.desiredEntries) > -1) {
        try {
          this.desiredEntries = JSON.parse(localStorage.getItem(localStorageKey.desiredEntries))
        } catch (error) {
          localStorage.removeItem(localStorageKey.desiredEntries)
         }
      }
    },
    saveAll () {
      localStorage.setItem(localStorageKey.account, JSON.stringify(this.account))
      localStorage.setItem(localStorageKey.desiredEntries, JSON.stringify(this.desiredEntries))
    }
  }
})
