<template lang="pug">
div.fixed.w-full.h-full.inset-0.bg-black.bg-opacity-80.flex(style="z-index: 2")
    div.rounded-lg.p-2.bg-white(style="width: 500px; height: 400px; margin: auto;")
        div.w-min.h-min.text-black(style="margin-left: auto;")
            p.cursor-pointer(@click="emitClose") X
        p.w-full.text-center Help
        p Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia numquam atque sed dolorem laudantium minus ullam totam voluptatem hic doloremque aut temporibus impedit distinctio architecto eveniet quos sit ducimus, veniam tenetur qui consequuntur accusamus dolore consectetur. Atque mollitia quaerat deleniti rerum aliquid suscipit nulla facere quia pariatur at autem dolorem officia eius rem ea delectus non veniam facilis hic, doloribus, nisi dolor dicta illo iure. Dolorum ut expedita recusandae distinctio commodi nam accusantium. Accusamus eius repellendus distinctio at dolore ducimus? Natus, at vel? Quaerat, at, nemo repudiandae labore itaque dolorem provident sequi voluptatum nostrum quasi facere cum asperiores deleniti quisquam?
</template>

<script setup lang="ts">
const emit = defineEmits(['closeHelpOverlay'])
const emitClose = () => {
    emit('closeHelpOverlay')
}
</script>