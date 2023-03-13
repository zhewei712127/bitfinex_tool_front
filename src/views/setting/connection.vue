<template>
  <div class="app-container">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules">
        <div class="title-container">
          <h3 class="title">Connection Bitfinex</h3>
        </div>
        <el-row style="text-align: right">
          <el-button type="success" style="margin-bottom:30px" @click="update">Update</el-button>
        </el-row>
        <el-form-item prop="api_key">
          <el-input
            ref="api_key"
            v-model="form.api_key"
            placeholder="API KEY"
            name="api_key"
            type="text"
            tabindex="1"
            auto-complete="on"
            :disabled="form.disabled"
          />
        </el-form-item>
        <el-form-item prop="api_secret">
          <el-input
            ref="api_secret"
            v-model="form.api_secret"
            placeholder="API SECRET"
            name="api_secret"
            type="text"
            tabindex="1"
            auto-complete="on"
            :disabled="form.disabled"
          />
        </el-form-item>
        <el-row style="text-align: right">
          <el-button :loading="loading" type="primary" style="margin-bottom:30px" @click.native.prevent="connect">Connection</el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConnection, createConnection } from '../../api/connection'

export default {
  name: 'Connection',
  data() {
    return {
      form: {
        api_key: '',
        api_secret: '',
        disabled: false
      },
      rules: {
        api_key: [
          { required: true, message: '請輸入API KEY', trigger: 'blur' }
        ],
        api_secret: [
          { required: true, message: '請輸入API SECRET', trigger: 'blur' }
        ]
      },
      loading: false
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
      if (this.connection_id) {
        const ret = await getConnection(this.connection_id)
        this.form.api_key = ret.data.connection.api_key
        this.form.api_secret = ret.data.connection.api_secret
        this.form.disabled = true
      }
    },
    connect() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) {
          return false
        }

        const data = {
          api_key: this.form.api_key,
          api_secret: this.form.api_secret
        }

        const retConn = await createConnection(data)
        const ret = await getConnection(retConn.data.connection.id)
        this.form.api_key = ret.data.connection.api_key
        this.form.api_secret = ret.data.connection.api_secret
        this.form.disabled = true

        this.$message({
          message: '成功更新綁定',
          type: 'success'
        })
      })
    },
    update() {
      this.form.api_key = ''
      this.form.api_secret = ''
      this.form.disabled = false
    }
  }
}
</script>
