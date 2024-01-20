<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
}

withDefaults(defineProps<Props>(), {
  width: '60%',
  height: '400px'
});
</script>

<template>
  <div :class="$style['js-fiddle']">
    <iframe
      src="//jsfiddle.net/ferreiratb/0Lezvkfa/27/embedded/result,js,html,css/dark/"
      :width="width"
      :height="height"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<style module>
.js-fiddle {
  display: flex;
  justify-content: center;
}
</style>
