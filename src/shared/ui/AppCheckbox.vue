<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.checked);
};
</script>

<template>
  <div class="checkbox">
    <label class="custom-switch">
      <input
        :checked="modelValue"
        type="checkbox"
        name="favorite"
        @input="handleInput"
      />

      <span class="slider" />
    </label>

    <div class="checkbox__text">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$green: #39db7f;

.custom-switch {
  --width: 44px;
  --height: 24px;
  --knob-size: calc(var(--height) - 6px);
  position: relative;
  display: inline-block;
  width: var(--width);
  height: var(--height);
}

.custom-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-switch .slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  border-radius: var(--height);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.custom-switch .slider::before {
  content: "";
  position: absolute;
  height: var(--knob-size);
  width: var(--knob-size);
  bottom: calc((var(--height) - var(--knob-size)) / 2);
  inset-inline-start: 3px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}

.custom-switch input:checked+.slider {
  background-color: $green;
}

.custom-switch input:checked+.slider::before {
  transform: translateX(calc(var(--width) - var(--knob-size) - 6px));
}

.custom-switch .slider:hover {
  box-shadow: 0 0 2px $green;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
