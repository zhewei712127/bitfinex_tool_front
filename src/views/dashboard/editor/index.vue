<template>
  <div class="app-container">
    <div v-loading="loading">
      <el-card style="margin-top:24px">
        <h2>Hi, {{ name }} {{ roles }}</h2>
        <div>
          <strong>Welcome to Bitfinex Tool!</strong>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardEditor',
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
  },
  methods: {
  }
}
</script>
