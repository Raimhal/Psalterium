<template>
  <button type="button" class="out-btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "my-button"
}
</script>

<style scoped>
.out-btn{
  font-size: 12px !important;
  border-radius: 5px;
  padding: 15px 25px;
  background-color: #7072F7;
  border: none;
  color: #ffffff;
}
.out-btn:hover {
  background-color: white;
  color: #7072F7;
  transition: 0.5s ease;
}
.out-btn:active {
  background-color: inherit !important;
  color: white;

}

</style>