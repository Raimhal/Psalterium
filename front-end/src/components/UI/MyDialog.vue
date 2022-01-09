<template>
  <div class="dialog" v-if="show" @click="hideDialog" v-focus>
    <div class="dialog__content" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script>

import toggleDialogMixin from "@/mixins/toggleDialogMixin";

export default {
  name: "MyDialog",
  mixins: [toggleDialogMixin],
}
</script>

<style scoped>
.dialog{
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  display: flex;
  z-index: 100;
}

.dialog__content{
  margin: auto;
  border-radius: 5px;
}
</style>