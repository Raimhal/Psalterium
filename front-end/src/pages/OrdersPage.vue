<template>
  <div>
    <order-list :orders="orders">
    </order-list>
  </div>
</template>

<script>
import OrderList from "@/components/OrderList";
import {mapActions, mapState} from "vuex";
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
  mounted() {
    if(this.isAuth)
      this.getOrders()
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      orders: state => state.order.orders
    })
  },
  methods: {
    ...mapActions({
      getOrders: 'order/getOrders'
    })
  }
}
</script>

<style scoped>

</style>