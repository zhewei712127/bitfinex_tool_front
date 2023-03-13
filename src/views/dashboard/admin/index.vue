<template>
  <div class="app-container">
    <div v-loading="loading">
      <div v-if="connection_id">
        <wallets :wallet="wallet" />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { wallets } from '../../../api/bitfinex'
import Wallets from '@/components/Wallets'

export default {
  name: 'DashboardAdmin',
  components: {
    Wallets
  },
  data() {
    return {
      loading: false,
      wallet: {}
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
      if (this.connection_id !== 0) {
        const ret = await wallets()
        this.wallet = ret.data.wallets
      }
    },
    connection() {
      this.$router.push({ path: 'setting/connection' })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
