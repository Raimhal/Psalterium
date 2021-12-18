import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminPage from "@/pages/AdminPage";
import AccountPage from "@/pages/AccountPage";
import StoreBooksPage from "@/pages/StoreBooksPage";

const routes = [
  {
    path: "/login",
    component: LoginPage
  },
  {
    path: "/register",
    component: RegisterPage
  },
  {
    path: "/logout",
  },
  {
    path: "/",
    component: StoreBooksPage
  },
  {
    path: "/admin",
    component: AdminPage
  },
  {
    path: "/account",
    component: AccountPage
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL)
})




export default router