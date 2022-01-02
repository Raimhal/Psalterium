import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminPage from "@/pages/AdminPage";
import AccountPage from "@/pages/AccountPage";
import StoreBooksPage from "@/pages/StoreBooksPage";
import StoreBookPage from "@/pages/StoreBookPage";
import MyBooksPage from "@/pages/MyBooksPage";
import OrdersPage from "@/pages/OrdersPage";
import NotFoundPage from "@/pages/NotFoundPage";

const routes = [
  {
    path: "/login",
    component: LoginPage,
    meta: { title: 'Log in' }
  },
  {
    path: "/register",
    component: RegisterPage,
    meta: { title: 'Register' }
  },
  {
    path: "/logout",
  },
  {
    path: "/",
    component: StoreBooksPage,
    meta: { title: 'Shop' }
  },
  {
    path: "/my/books",
    component: MyBooksPage,
    meta: { title: 'Books' }
  },
  {
    path: "/books/:id",
    component: StoreBookPage,
    meta: { title: 'Book' }
  },
  {
    path: "/orders",
    component: OrdersPage,
    meta: { title: 'Orders' }
  },
  {
    path: "/admin",
    component: AdminPage,
    meta: { title: 'Admin' }
  },
  {
    path: "/account",
    component: AccountPage,
    meta: { title: 'Account' }
  },
  {
    path: "/:pathMatch(.*)*" ,
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: '404 Not found' }
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL)
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
});


export default router