<template>
    <table class="types__table">
      <caption>File types : </caption>
      <thead>
      <tr>
        <th>File type</th>
        <th>Size</th>
        <th></th>
      </tr>
      </thead>
      <tbody class="body">
        <tr v-for="type in fileTypes" :key="type.id" class="user">
          <td>{{type.fileType}}</td>
          <td>{{type.fileSize}} MB</td>
          <td class="btns">
            <my-button @click="removeType(type.id)"> Delete </my-button>
            <my-button @click="showUpdateDialog(type.id)"> Edit </my-button>
          </td>
        </tr>
      </tbody>
    </table>
    <my-dialog v-model:show="fileTypeUpdateDialogVisible">
      <file-type-form :modified="true">
        <template v-slot:submit__name>
          Save
        </template>
      </file-type-form>
    </my-dialog>
</template>

<script>

import MyButton from "./UI/MyButton";
import MyDialog from "./UI/MyDialog";
import FileTypeForm from "./FileTypeForm";
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  name: "AllowedExtensionList",
  components: {FileTypeForm, MyDialog, MyButton},
  data(){
    return {
      fileTypeUpdateDialogVisible: false,
    }
  },
  props: {
    fileTypes: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState({
      file: state => state.file.file,
    }),
  },
  methods: {
    ...mapMutations({
      setFileType: 'file/setFileType'
    }),
    ...mapActions({
      updateType: 'file/updateFileType',
      removeType: 'file/removeFileType',
      getFileType: 'file/getFileType'
    }),
    async showUpdateDialog(id){
      this.setFileType(await this.getFileType(id))
      this.fileTypeUpdateDialogVisible = true
    }

  },
}

</script>

<style scoped>

</style>