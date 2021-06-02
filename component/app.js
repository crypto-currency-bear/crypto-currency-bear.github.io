const localStorageKey = {
  tabs: 'tabs'
}

const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data () {
    return {
      activeTabIndex: 0,
      tabs: [{ ...this.getInitTab() }],
      isShowTabsSettingDialog: false,
      checkedTabIndexes: []
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
    this.initialize(this.getAllStoredTabs)
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
    onClickAddTab () {
      this.tabs = this.tabs.concat([{ ...this.getInitTab() }])
    },
    onClickRemoveTabs () {
      this.tabs = this.tabs.filter((v, i) => this.checkedTabIndexes.indexOf(i) < 0)
    },
    onClickCloseTabSettingDialog () {
      this.checkedTabIndexes = []
      this.isShowTabsSettingDialog = false
    },
    onClickInitialize () {
      this.initialize(this.deleteAllStoredTabs)
    },
    onClickAddDesiredEntry () {
      this.tabs[this.activeTabIndex].desiredEntries = [{ ...this.getInitCryptoCurrency() }].concat(this.tabs[this.activeTabIndex].desiredEntries)

      this.focusDesiredEntry(0)
    },
    onClickRemoveDesiredEntry (index) {
      this.tabs[this.activeTabIndex].desiredEntries = this.tabs[this.activeTabIndex].desiredEntries.filter((v, i) => i !== index)
    },
    calculateTotalQuantity () {
      const activeTab = this.tabs[this.activeTabIndex]

      const accountQuantity = this.parseToInteger(activeTab.account.quantity)
      const totalDesiredQuantity = activeTab.desiredEntries.reduce((acc, curr) => acc + this.parseToInteger(curr.quantity), 0)

      return accountQuantity + totalDesiredQuantity
    },
    calculateTotalPrice () {
      const activeTab = this.tabs[this.activeTabIndex]

      const accountEntryPrice = this.parseToInteger(activeTab.account.totalEntryPrice)
      const desiredTotalEntryPrice = activeTab.desiredEntries.reduce((acc, curr) => acc + this.parseToInteger(curr.totalEntryPrice), 0)

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
    initialize (onAfterInitialize = () => {}) {
      this.activeTabIndex = 0
      this.tabs = [{ ...this.getInitTab() }]

      onAfterInitialize()
    },
    saveAll () {
      localStorage.setItem(localStorageKey.tabs, JSON.stringify(this.tabs))
    },
    getAllStoredTabs () {
      const localStorageKeys = Object.keys(localStorage)

      if (localStorageKeys.indexOf(localStorageKey.tabs) > -1) {
        try {
          this.tabs = JSON.parse(localStorage.getItem(localStorageKey.tabs))
        } catch (error) {
          this.deleteAllStoredTabs()
        }
      }
    },
    deleteAllStoredTabs () {
      localStorage.removeItem(localStorageKey.tabs)
    },
    getInitTab () {
      return {
        name: '종목명',
        account: { ...this.getInitCryptoCurrency() },
        desiredEntries: [ this.getInitCryptoCurrency() ]
      }
    }
  }
})
