<template>
  <div class="app-container">
    <div v-if="connection_id">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="8" style="margin-bottom: 12px">
          <el-card>
            <div><el-tag>牌價</el-tag></div>
            <el-table v-loading="loading.ticker" :data="tickers" border style="margin-top: 12px" @row-click="tickerClick">
              <el-table-column prop="symbol" label="幣別">
                <template slot-scope="scope">
                  {{ map[scope.row.symbol] }}
                </template>
              </el-table-column>
              <el-table-column prop="price" label="價格" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="16">
          <el-card>
            <div><el-tag style="margin-right: 12px">掛單簿</el-tag><el-tag type="success">{{ map[symbol] }}</el-tag></div>
            <el-row style="margin-top: 12px">
              <el-col :xs="24" :sm="12">
                <el-table v-loading="loading.book" :data="books.purchase" border @row-click="purchaseClick">
                  <el-table-column prop="total" label="委買量" />
                  <el-table-column prop="price" label="買價" />
                </el-table>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-table v-loading="loading.book" :data="books.sale" border @row-click="saleClick">
                  <el-table-column prop="price" label="賣價" />
                  <el-table-column prop="total" label="委賣量" />
                </el-table>
              </el-col>
            </el-row>
            <div style="margin-top: 24px">
              <div style="border: #ccc 1px solid; padding: 5px">
                <el-row style="margin:5px">
                  <el-col>
                    <el-tag type="info">餘額</el-tag>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 12px">
                  <el-col :span="12">
                    <small style="padding-left:12px">{{ books.currency.from }}: {{ Object.prototype.hasOwnProperty.call(wallet, books.currency.from) && wallet[books.currency.from].available_balance >= 0.00000001 ? (wallet[books.currency.from].available_balance).toFixed(8) : 0 }}</small>
                  </el-col>
                  <el-col :span="12">
                    <small style="padding-left:12px">{{ books.currency.to }}: {{ Object.prototype.hasOwnProperty.call(wallet, books.currency.to) ? (wallet[books.currency.to].available_balance).toFixed(2) : 0 }}</small>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 12px" :gutter="10">
                  <el-form label-width="50px">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="價格">
                        <el-input v-model.number="form.price" />
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" :loading="form.loading.purchase" @click="purchaseOrder()">{{ books.currency.from }} 買入</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="數量">
                        <el-input v-model.number="form.amount" />
                      </el-form-item>
                      <el-form-item>
                        <el-button type="success" :loading="form.loading.sale" @click="saleOrder()">{{ books.currency.from }} 賣出</el-button>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <div>
        <el-card>
          <div>
            <span style="margin-right: 24px">綁定 Bitfinex api key 和 api secret</span>
            <el-button type="primary" @click="connection">Connection</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { tickers, book, wallets, createOrder } from '../../api/bitfinex'

const symbols = 'tUSTUSD,tBTCUSD,tBTCUST,tETHUSD,tETHUST,tETHBTC'

export default {
  name: 'Trade',
  data() {
    return {
      map: {
        tUSTUSD: 'USDT/USD',
        tBTCUSD: 'BTC/USD',
        tBTCUST: 'BTC/USDT',
        tETHUSD: 'ETH/USD',
        tETHUST: 'ETH/USDT',
        tETHBTC: 'ETH/BTC'
      },
      tickers: [],
      books: {
        purchase: [],
        sale: [],
        currency: {
          from: 'UST',
          to: 'USD'
        }
      },
      symbol: 'tUSTUSD',
      loading: {
        ticker: false,
        book: false
      },
      wallet: {},
      form: {
        price: 0,
        amount: 0,
        loading: {
          purchase: false,
          sale: false
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'connection_id'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      if (this.connection_id === 0) {
        return
      }
      const ret_wallet = await wallets()
      this.wallet = ret_wallet.data.wallets.exchange
      this.loading.ticker = true
      const ret_tickers = await tickers({ symbols: symbols })
      this.tickerParse(ret_tickers)
      this.loading.ticker = false
      this.loading.book = true
      const ret_books = await book({ symbol: this.symbol })
      this.bookParse(ret_books)
      this.loading.book = false
    },
    async tickerClick(row) {
      this.books.currency.from = row.symbol.substr(1, 3)
      this.books.currency.to = row.symbol.substr(-3)
      this.form.price = 0
      this.form.amount = 0
      this.symbol = row.symbol
      this.loading.book = true
      const ret_books = await book({ symbol: row.symbol })
      this.bookParse(ret_books)
      this.loading.book = false
    },
    purchaseClick(row) {
      this.form.price = row.price
      const wallet = Object.prototype.hasOwnProperty.call(this.wallet, this.books.currency.to) ? this.wallet[this.books.currency.to].available_balance : 0
      const amount = Math.floor(wallet * 1000000 / row.price)
      this.form.amount = amount / 1000000
    },
    saleClick(row) {
      this.form.price = row.price
      const wallet = Object.prototype.hasOwnProperty.call(this.wallet, this.books.currency.from) ? this.wallet[this.books.currency.from].available_balance : 0
      const amount = Math.floor(wallet * 1000000)
      this.form.amount = amount / 1000000
    },
    tickerParse(ret_tickers) {
      this.tickers = []
      for (const item of ret_tickers.data.tickers) {
        this.tickers.push({
          symbol: item[0],
          price: item[1]
        })
      }
    },
    bookParse(ret_books) {
      this.books.purchase = []
      this.books.sale = []
      for (const item of ret_books.data.books) {
        if (item[2] > 0) {
          if (this.books.purchase.length >= 5) {
            continue
          }
          this.books.purchase.push({
            price: item[0],
            total: item[2] >= 1 ? (Math.abs(Math.round(item[2]))).toLocaleString() : Math.abs(item[2])
          })
        } else {
          if (this.books.sale.length >= 5) {
            continue
          }
          this.books.sale.push({
            price: item[0],
            total: Math.abs(item[2]) >= 1 ? (Math.abs(Math.round(item[2]))).toLocaleString() : Math.abs(item[2])
          })
        }
      }
    },
    async purchaseOrder() {
      const data = {
        type: 'EXCHANGE LIMIT',
        symbol: this.symbol,
        price: this.form.price.toString(),
        amount: this.form.amount.toString()
      }

      this.form.loading.purchase = true

      let status = true
      await createOrder(data).catch(() => {
        this.form.loading.purchase = false
        status = false
      })

      if (!status) {
        return
      }

      this.$message({
        message: '訂單成功',
        type: 'success'
      })

      this.form.loading.purchase = false

      this.form.price = 0
      this.form.amount = 0

      const ret_wallet = await wallets()
      this.wallet = ret_wallet.data.wallets.exchange
    },
    async saleOrder() {
      const data = {
        type: 'EXCHANGE LIMIT',
        symbol: this.symbol,
        price: this.form.price.toString(),
        amount: (this.form.amount * -1).toString()
      }

      this.form.loading.sale = true

      let status = true
      const ret = await createOrder(data).catch(() => {
        this.form.loading.sale = false
        status = false
      })

      if (!status) {
        return
      }

      console.log(ret)

      this.$message({
        message: '訂單成功',
        type: 'success'
      })

      this.form.loading.sale = false

      this.form.price = 0
      this.form.amount = 0

      const ret_wallet = await wallets()
      this.wallet = ret_wallet.data.wallets.exchange
    },
    connection() {
      this.$router.push({ path: 'setting/connection' })
    }
  }
}
</script>
