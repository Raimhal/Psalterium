<template>
  <div class="page">
    <div class="users">
      <user-list :users="users">
      </user-list>
    </div>
    <div class="types">
      <allowed-extension-list :file-types="fileTypes"></allowed-extension-list>
    </div>
    <div class="btns">
      <my-button @click="$router.back()"> Back </my-button>
    </div>
    <my-dialog v-model:show="fileTypeDialogVisible">
      <file-type-form>
        <template v-slot:submit__name>
          Add
        </template>
      </file-type-form>
    </my-dialog>
  </div>
</template>
<script>
import UserList from "../components/UserList";
import {mapActions, mapMutations, mapState} from "vuex";
import AllowedExtensionList from "@/components/AllowedExtensionList";
import FileTypeForm from "../components/FileTypeForm";
import MyButton from "../components/UI/MyButton";

export default {
  name: "AdminPage",
  components: {MyButton, FileTypeForm, AllowedExtensionList, UserList},
  data(){
    return{
      fileTypeDialogVisible: false,
      fileTypeUpdateDialogVisible: false,
      modified: false,
      length: 1,
      id: null,
      root: 'books'
    }
  },
  mounted() {
    if(this.isAdmin && this.isAuth) {
        this.getUsers()
        this.getFileTypes()
    }
    else {
      this.$store.state.errors.push('You are not an admin')
      this.$router.push('/login')
    }
  },
  beforeUnmount() {
    if(this.isAdmin)
      this.clearErrors()
    this.clearUsers()
  },
  methods: {
    ...mapMutations({
      clearFileType: 'file/clearFileType',
      clearErrors: 'clearErrors',
      clearUsers: 'user/clearUsers',
      clearFileTypes: 'file/clearFileTypes'
    }),
    ...mapActions({
      getUsers: 'user/getUsers',
      getFileTypes: 'file/getAllowedFileTypes',
      addFileType: 'file/addFileType',

    }),
    async showFileTypeDialog(){
      this.clearFileType()
      this.fileTypeDialogVisible = true
    }

  },
  computed: {
    ...mapState({
      isAdmin: state => state.isAdmin,
      isAuth: state => state.isAuth,
      users: state => state.user.users,
      fileTypes: state => state.file.fileTypes,
      file: state => state.file.file,

    }),
  },
}
</script>

<style scoped>

</style>