<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "my-button"
}
</script>

<style scoped>
.btn{
  border-color: rgb(255, 153, 0);
  border-radius: 5px;
  margin-top: 5px;
  background: none;
  padding: 10px 10px;
  color: rgb(255, 153, 0);
  cursor: pointer;
}
.btn:hover {
  background-color: rgb(255, 153, 0);
  color: black;
  transition: 0.8s;
}
.btn:active {
  background-color: black !important;
  color: rgb(255, 153, 0);
}

</style>