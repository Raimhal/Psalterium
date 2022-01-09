<template>
  <div class="empty__list">
    <img src="@/assets/wrong_negate.png" height="128" width="128"/>
    <h4>
      <slot></slot>
    </h4>
  </div>
</template>

<script>
export default {
  name: "EmptyList"
}
</script>

<style scoped>

.empty__list{
  width: 100%;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: absolute;
}
</style>