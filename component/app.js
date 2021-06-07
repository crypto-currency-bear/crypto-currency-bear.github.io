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
      expectedTabs: [],
      isShowTabsSettingDialog: false
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
    this.initialize(() => {
        this.getAllStoredTabs()
        this.correctTabIndexes()
    })
    this.focusAccountEntryPrice()
  },
  methods: {
    onChangeActiveTab (event) {
      console.log(event)
    },
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
      this.expectedTabs = this.expectedTabs.concat([{ ...this.getInitTab() }])
      this.correctTabIndexes()
    },
    onClickRemoveTabs () {
      this.expectedTabs = this.expectedTabs.filter(v => !v.isChecked)
      this.correctTabIndexes()
      this.clearCheckedTabIndexes()
    },
    onClickSaveTabs () {
      this.tabs = this.deepCopy(this.expectedTabs)
      this.correctTabIndexes()

      this.saveAll()
      this.onClickCloseTabSettingDialog()
    },
    onClickOpenTabSettingDialog () {
      this.clearCheckedTabIndexes()
      this.expectedTabs = this.deepCopy(this.tabs)

      this.isShowTabsSettingDialog = true
    },
    onClickCloseTabSettingDialog () {
      this.clearCheckedTabIndexes()
      this.expectedTabs = []

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
    saveAll () {
      localStorage.setItem(localStorageKey.tabs, JSON.stringify(this.tabs))
    },
    deleteAllStoredTabs () {
      localStorage.removeItem(localStorageKey.tabs)
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
    clearCheckedTabIndexes () {
      this.expectedTabs = this.expectedTabs.map(v => {
        v.isChecked = null

        return v
      })
    },
    deepCopy (source) {
      return JSON.parse(JSON.stringify(source))
    },
    getInitCryptoCurrency () {
      return {
        entryPrice: null,
        quantity: null,
        totalEntryPrice: null
      }
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
    getInitTab () {
      return {
        name: '종목명',
        account: { ...this.getInitCryptoCurrency() },
        desiredEntries: [ this.getInitCryptoCurrency() ],
        index: 0
      }
    },
    correctTabIndexes () {
      this.tabs = this.tabs.map((v, i) => {
        v.index = i

        return v
      })
    }
  }
})
