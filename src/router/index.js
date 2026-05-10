import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";

const AUTH_ROUTES = ["items-grades", "items-choose"];
export const BUILDING_ROUTES = ["items-classGrade"];
const pageComps = import.meta.glob("../views/**/index.vue");
const routes = Object.entries(pageComps).map(([path]) => {
  const pageJSPath = path;
  path = path.replace("../views", "").replace("/index.vue", "") || "/";
  const name = path.split("/").filter(Boolean).join("-") || "index";
  const compPath = pageJSPath.replace("page.js", "index.vue");
  console.log(name);
  return {
    path,
    name,
    component: pageComps[compPath],
    meta: {},
  };
});

routes.forEach((route) => {
  if (AUTH_ROUTES.includes(route.name)) {
    route.meta = { ...route.meta, requiresAuth: true };
  }
  if (BUILDING_ROUTES.includes(route.name)) {
    route.meta = { ...route.meta, isBuilding: true };
  }
});
const notFoundRouter = {
  name: "NotFound",
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  meta: {},
  component: () => import("@/views/404/index.vue"),
};
const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, notFoundRouter],
});

router.beforeEach(async (to, from) => {
  console.log(from);
  const userStore = useUserStore();
  // 检查目标路由是否需要认证
  if (to.meta.isBuilding) {
    router.push(`/404?redirect=${String(to.name)}`);
  } else if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 用户未登录且尝试访问需要认证的页面，重定向到登录页
    router.push(`/login?redirect=${String(to.name)}`);
  }
});
export default router;
