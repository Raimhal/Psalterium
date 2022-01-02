<template>
  <button type="button" class="out-btn p-3">
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
  background-color: #7072F7;
  border: none;
  color: #ffffff;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
}
.out-btn:hover {
  background-color: white;
  color: #292a5c;
}
.out-btn:active {
  background-color: inherit !important;
  color: white;

}

</style>