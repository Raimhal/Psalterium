<template>
  <div>
    <order-list :is-admin="isAdmin">
      <template v-slot:image>
        <img src="@/assets/sent_negate.png" height="32" width="32" class="mb-2"/>
      </template>
    </order-list>
  </div>
</template>

<script>
import OrderList from "@/components/OrderList";
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  name: "OrdersPage",
  components: {OrderList},
  beforeRouteEnter(to, from, next){
    next(vm => {
      if(!vm.isAuth) {
        vm.errors.push('You are not authorized')
        vm.$router.push('/login')
      }
    })
  },
  beforeUnmount() {
    this.clearOrders()
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      isAdmin: state => state.isAdmin,
      orders: state => state.order.orders,
      errors: state => state.errors
    })
  },
  methods: {
    ...mapActions({
      getOrders: 'order/getOrders'
    }),
    ...mapMutations({
      clearOrders: 'order/clearOrderStore'
    })
  }
}
</script>

<style scoped>

</style>