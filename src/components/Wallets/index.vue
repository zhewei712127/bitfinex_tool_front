<template>
  <el-row :gutter="20">
    <el-col :md="8" :xs="24">
      <el-card>
        <div class="card">
          <div class="title">
            <span>兌換</span>
          </div>
          <div class="content">
            <div v-if="Object.prototype.hasOwnProperty.call(wallet, 'exchange')">
              <div v-for="(item, key) in wallet.exchange" :key="'exchange' + key">
                <div style="margin-top: 12px; cursor: pointer;" @click="transfer('exchange', key)">{{ key }}</div>
                <div style="font-size: 16px">
                  <div>
                    <small>總計：{{ item.balance.toFixed(2) }}</small>
                  </div>
                  <div>
                    <small>可用：{{ item.available_balance.toFixed(2) }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              $ 0
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :md="8" :xs="24">
      <el-card>
        <div class="card">
          <div class="title">
            <span>保證金</span>
          </div>
          <div class="content">
            <div v-if="Object.prototype.hasOwnProperty.call(wallet, 'margin')">
              <div v-for="(item, key) in wallet.margin" :key="'margin' + key">
                <div style="margin-top: 12px; cursor: pointer" @click="transfer('margin', key)">{{ key }}</div>
                <div style="font-size: 16px">
                  <div>
                    <small>總計：{{ item.balance.toFixed(2) }}</small>
                  </div>
                  <div>
                    <small>可用：{{ item.available_balance.toFixed(2) }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              $ 0
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :md="8" :xs="24">
      <el-card>
        <div class="card">
          <div class="title">
            <span>融資</span>
          </div>
          <div class="content">
            <div v-if="Object.prototype.hasOwnProperty.call(wallet, 'funding')">
              <div v-for="(item, key) in wallet.funding" :key="'funding' + key">
                <div style="margin-top: 12px; cursor: pointer" @click="transfer('funding', key)">{{ key }}</div>
                <div style="font-size: 16px">
                  <div>
                    <small>總計：{{ item.balance.toFixed(2) }}</small>
                  </div>
                  <div>
                    <small>可用：{{ item.available_balance.toFixed(2) }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              $ 0
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-dialog :title="form.title" :visible.sync="show" width="30%">
      <div>
        <div>
          <small>Destination</small>
        </div>
        <div style="margin-top: 3px">
          <el-select v-model="form.to" placeholder="請選擇">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div style="margin-top: 6px">
          <small>{{ form.currency }} from {{ form.from }} to {{ form.to }}</small>
        </div>
        <div style="margin-top: 3px">
          <el-input-number v-model="form.amount" :min="0" :max="form.max" style="width: 300px" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="form.loading" @click="submit">確定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { transfer, wallets } from '../../api/bitfinex'

export default {
  name: 'Wallets',
  props: {
    wallet: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        title: '',
        from: '',
        to: '',
        currency: '',
        amount: 0,
        max: 0,
        loading: false
      },
      show: false,
      options: []
    }
  },
  methods: {
    transfer(type, currency) {
      console.log(this.wallet)
      this.form.title = currency + ' 錢包資金轉移'
      this.show = true
      this.form.from = type
      this.form.to = ''
      this.form.currency = currency
      this.form.amount = this.wallet[type][currency].available_balance.toFixed(2) === 0 ? 0 : this.wallet[type][currency].available_balance
      this.form.max = this.form.amount
      const options = [
        {
          label: '兌換',
          value: 'exchange'
        },
        {
          label: '保證金',
          value: 'margin'
        },
        {
          label: '融資',
          value: 'funding'
        }
      ]

      this.options = options.filter(function(item, index, array) {
        return item.value !== type
      })
    },
    async submit() {
      if (this.form.to === '') {
        this.$message({
          message: '請選取 Destination',
          type: 'warning'
        })
        return
      }

      if (this.form.amount <= 0) {
        this.$message({
          message: '數字需大於0',
          type: 'warning'
        })
        return
      }

      this.form.loading = true

      const data = {
        from: this.form.from,
        to: this.form.to,
        currency: this.form.currency,
        amount: this.form.amount.toString()
      }

      await transfer(data).catch(() => {
        this.form.loading = false
        return
      })

      const ret = await wallets().catch(() => {
        this.form.loading = false
        return
      })

      this.wallet = ret.data.wallets

      this.$message({
        message: '轉移成功',
        type: 'success'
      })

      this.form.loading = false

      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 12px;
}
.card {
  margin: 5px;
  .title {
    font-size: 18px;
  }
  .content {
    margin-top: 18px;
    font-size: 24px;
    color: #078ABC;
  }
}
</style>
