<script setup lang="ts">
import { inject, ref } from 'vue'
import Button from 'primevue/button'
const dialogRef: any = inject('dialogRef')

const closeDialog = () => {
    dialogRef.value.close()
}

</script>
<template>
    <p>Link Card</p>
    <Button @click="closeDialog" label="Close" />
</template>
