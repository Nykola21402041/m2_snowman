<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
  import AbstractPage from "./AbstractPage";
  export default {
    name: "About",
    extends: AbstractPage,
    data: function () {
      return {
        title: "About"
      }
    }
  }
</script>
