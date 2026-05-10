<template>
  <div class="body">
    <h1>{{ httpCode }}</h1>
    <p v-if="httpCode === 404">
      Sorry, the page you are looking for could not be found.
    </p>
    <p v-else>
      Sorry, the page you are looking for is not allowed. Maybe it still
      building.
    </p>
    <a class="button" href="/"
      ><i class="icon-home"></i> Go back in initial page, is better.</a
    >
  </div>
</template>

<script setup>
import { getQueryString } from "@/function/getQueryString";
import { BUILDING_ROUTES } from "@/router/index";
const httpCode = ref(404);
const redirect = Object.freeze(getQueryString("redirect"));
if (
  typeof redirect === "string" &&
  BUILDING_ROUTES.some((route) => redirect.includes(route))
) {
  httpCode.value = 403;
} else {
  httpCode.value = 404;
}
</script>

<style src="./index.scss" scoped></style>
