<template>
  <div class="home">
    <p5 v-on="this"></p5>
  </div>
</template>

<script>
import p5 from "vue-p5";

export default {
  name: "home",
  components: {
    p5
  },
  methods: {
    setup(sketch) {
      sketch.background("green");
      sketch.text("Hello p5!", 20, 20);
    }
  }
};
</script>