<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'index'
});

const auth = useAuth().value;
if(auth) await navigateTo('/admin');
</script>