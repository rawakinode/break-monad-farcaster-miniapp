import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/BookView.vue') },
  { path: '/myarticle', name: 'myarticle', component: () => import('../views/MyArticles.vue') },
  { path: '/create', name: 'create', component: () => import('../views/CreateView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
  {
    path: '/article/:id',
    name: 'article',
    component: () => import('../views/ArticleView.vue'),
    props: true
  },
  {
    path: '/author/:id',
    name: 'author',
    component: () => import('../views/AuthorView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Jika pengguna menekan tombol "back", kembalikan posisi sebelumnya
    if (savedPosition) {
      return savedPosition
    } else {
      // Jika navigasi ke halaman baru, scroll ke atas
      return { top: 0 }
    }
  }
})

export default router