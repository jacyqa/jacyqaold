<template>
  <main>
    <div class="container abb">
      <div class="forms-container">
        <div class="signin-signup">
          <el-button v-if="!showSignInForm" @click="logout" type="primary"
            >退登</el-button
          >
          <form v-if="showSignInForm" action="#" class="sign-in-form">
            <h2 class="title">登录</h2>

            <el-input
              v-model="username"
              type="text"
              style="width: 240px"
              placeholder="用户名"
              clearable
            />

            <el-input
              v-model="password"
              type="password"
              style="width: 240px"
              placeholder="密码"
              show-password
            />

            <el-button @click="login" type="primary" class="btn solid"
              >登录</el-button
            >
          </form>
          <form action="#" class="sign-up-form">
            <h2 class="title">注册?</h2>

            <el-input type="text" style="width: 240px" placeholder="用户名" />

            <el-input type="email" style="width: 240px" placeholder="邮箱" />

            <el-input type="password" style="width: 240px" placeholder="密码" />

            <el-button type="primary" class="btn">立即注册</el-button>
          </form>
        </div>
      </div>

      <div class="panels-container">
        <div class="panel left-panel">
          <div class="content">
            <h3>加入我们</h3>
            <p>加入我们，成为本站的一份子。</p>
            <button class="btn transparent" id="sign-up-btn">去注册</button>
          </div>
          <img src="../../assets/img/log.svg" class="image" alt="" />
        </div>
        <div class="panel right-panel">
          <div class="content">
            <h3>已有帐号？</h3>
            <p>立即登录已有帐号，享受独家权益。</p>
            <button class="btn transparent" id="sign-in-btn">去登录</button>
          </div>
          <img src="../../assets/img/register.svg" class="image" alt="" />
        </div>
      </div>
    </div>
  </main>
</template>

<!-- <script src="https://kit.fontawesome.com/64d58efce2.js" crossorigin="anonymous"></script> -->
<script crossorigin="anonymous">
//@ts-nocheck
import { useUserStore } from "@/stores/user";
import router from "@/router/index";
import { getQueryString } from "@/function/getQueryString";

export default {
  setup() {
    const userStore = useUserStore();

    const showSignInForm = computed(() => !userStore.isLoggedIn);
    const password = ref("");
    const username = ref("");

    onMounted(() => {
      const sign_in_btn = document.querySelector("#sign-in-btn");
      const sign_up_btn = document.querySelector("#sign-up-btn");
      const container = document.querySelector(".container");

      sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });

      sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    });
    function login() {
      const userStore = useUserStore();
      if (username.value === "admin" && password.value === "admin") {
        userStore.login();
        const redirect = router.resolve({
          name: Object.freeze(getQueryString("redirect")) || "index",
        });
        router.push(redirect.fullPath);
        // router.push($route.query.redirect);
      } else {
        confirm("用户名或密码错误");
        password.value = "";
        username.value = "";
        return;
      }
    }

    function logout() {
      const userStore = useUserStore();
      userStore.logout();
    }
    return {
      logout,
      showSignInForm,
      login,
      password,
      username,
    };
  },
};
</script>
<style scoped src="./index.css"></style>
