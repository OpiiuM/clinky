<script setup>
import GuiButton from '@/modules/gui/GuiButton.vue';
// import GuiInput from '@/modules/gui/GuiInput.vue';
// import GuiCheckbox from '@/modules/gui/GuiCheckbox.vue';
// import GuiSelect from '@/modules/gui/GuiSelect.vue';
// import GuiTabs from '@/modules/gui/GuiTabs.vue';
// import GuiModal from '@/modules/gui/GuiModal.vue';

const elements = [GuiButton];
</script>

<template>
  <div class="page__content">
    <div class="page__container container">
      <div class="gui">
        <h2 style="margin-top: 24px">GUI</h2>

        <section
          v-for="(component, index) in elements"
          :key="index"
          class="gui__section"
        >
          <component :is="component" />
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gui {
  &__section {
    margin-bottom: rem($gap-medium);
    padding-bottom: rem($gap-medium);

    border-bottom: rem(1px) solid $silver-chalice;
  }
}
</style>
