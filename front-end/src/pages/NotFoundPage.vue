<template>
  <div class="page">
    <img src="@/assets/error_404_negate.png" height="100" width="100"/>
    <span>Page not found</span>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage"
}
</script>

<style scoped>
.page{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  gap: 3px;
}
</style>