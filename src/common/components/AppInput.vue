<script>
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'input',
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
    },
    modificators: {
      type: Array,
      default: () => [],
    },
  },

  setup(props, { slots, emit }) {
    const field = ref(null);

    const computedClass = computed(() => {
      const classes = {
        'field--textarea': props.tag === 'textarea',
        'field--has-error': props.hasError,
        'field--required': props.required,
        'field--has-suffix': !!slots.suffix,
      };

      const modifications = props.modificators.map((type) => `field--${type}`);

      return [classes, ...modifications];
    });

    const handleClick = () => {
      if (field.value.value.length) {
        emit('push', field.value.value);
      }
    };

    return {
      field,
      computedClass,
      handleClick,
    };
  },
});
</script>

<template>
  <div
    class="field"
    :class="computedClass"
  >
    <span
      v-if="label"
      class="field__label"
    >
      {{ label }}
    </span>
    <div class="field__control">
      <component
        :is="tag"
        v-bind="$attrs"
        :value="modelValue"
        ref="field"
        class="field__input"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span
        v-if="$slots.suffix"
        class="field__suffix"
        @click="handleClick"
      >
        <slot name="suffix" />
      </span>
    </div>
    <div
      v-if="hasError && errorText"
      class="field__error"
    >
      {{ errorText }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.field {
  &--has-error & {
    &__error {
      display: block;
    }
  }

  &--textarea & {
    &__input {
      min-height: rem(140px);

      resize: none;
    }
  }

  &--required & {
    &__label {
      &::after {
        content: ' *';
      }
    }
  }

  &--light & {
    &__input {
      background-color: $scorpion;
    }
  }

  &--has-suffix & {
    &__input {
      padding-right: rem(36px);
    }
  }

  &__label {
    display: block;

    margin-bottom: rem($gap-mini);

    color: $white;
  }

  &__control {
    position: relative;
  }

  &__input {
    width: 100%;
    height: rem($height-field);
    padding: rem($gap-mini) rem(10px);

    transition: border-color $transition-duration $transition-function;

    color: $white;
    border: rem(1px) solid $mine-shaft-2;
    border-radius: rem($border-radius-micro);
    background-color: $mine-shaft-4;

    &:focus {
      border-color: $white;
      outline: none;
    }
  }

  &__suffix {
    position: absolute;
    top: 0;
    right: 0;

    padding: rem(10px) rem(8px);

    cursor: pointer;
    transition: color $transition-duration $transition-function;

    color: $silver-chalice;

    &:hover {
      color: $white;
    }
  }

  &__error {
    @include text-size(14px, 16px);

    display: none;

    margin-top: rem($gap-mini);

    color: $milano-red;
  }
}
</style>
