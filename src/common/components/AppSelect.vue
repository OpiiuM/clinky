<script setup>
import { ref, computed } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

import IconAngle from '@/assets/icons/angle-down.svg';
import IconEdit from '@/assets/icons/edit.svg';
import IconClose from '@/assets/icons/close.svg';

// TODO: DRY
const props = defineProps({
  modelValue: {
    type: [String, Array],
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  colorTags: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'orange', 'green'].includes(value),
  },
  hasInput: {
    type: Boolean,
    default: false,
  },
  removable: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['update:modelValue', 'add-value', 'remove-value']);

const isOpen = ref(false);
const field = ref('');

const sortedOptions = computed(() => {
  return [...props.options].sort();
});

const selectValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const hideDropdown = () => {
  isOpen.value = false;
};

const handleSelect = (item) => {
  if (props.multiple) {
    const data = [...selectValue.value];

    if (data.includes(item)) {
      data.splice(data.indexOf(item), 1);
    } else {
      data.push(item);
    }

    selectValue.value = data;
  } else {
    selectValue.value = item;
  }
};

const computedSelected = (value) => {
  return props.multiple ? selectValue.value.includes(value) : selectValue.value === value;
};

const selectedClass = (item) => {
  return {
    'select__dropdown-item--selected': computedSelected(item),
  };
};
</script>

<template>
  <div
    v-on-click-outside="hideDropdown"
    class="select"
  >
    <p
      v-if="props.label"
      class="select__label"
    >
      {{ props.label }}
    </p>
    <div
      class="select__face"
      :class="{ 'select__face--open': isOpen }"
      @click="isOpen = !isOpen"
    >
      <div class="select__face-container">
        <ul
          v-if="selectValue.length"
          class="select__face-list"
        >
          <template v-if="multiple">
            <li
              v-for="(item, index) in selectValue"
              :key="index"
              class="select__face-item face-value"
              :class="`select__face-item--${colorTags}`"
            >
              <div class="face-value__text">#{{ item }}</div>
              <icon-close
                v-if="removable"
                class="face-value__suffix icon icon--button"
                @click.stop="$emit('remove-value', item)"
              />
            </li>
          </template>
          <template v-else>
            <li
              class="select__face-item face-value"
              :class="`select__face-item--${colorTags}`"
            >
              <div class="face-value__text">#{{ selectValue }}</div>
              <icon-close
                v-if="removable"
                class="face-value__suffix icon icon--button"
                @click.stop="$emit('remove-value', item)"
              />
            </li>
          </template>
        </ul>
        <p
          v-else
          class="select__face-placeholder"
        >
          {{ placeholder }}
        </p>
      </div>
      <div class="select__face-suffix">
        <icon-angle
          class="select__face-icon icon"
          :class="{ 'select__face-icon--rotate': isOpen }"
        />
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="isOpen"
        class="select__dropdown"
        appear
      >
        <app-input
          v-if="hasInput"
          v-model="field"
          placeholder="New value"
          @push="$emit('add-value', $event)"
        >
          <template #suffix>
            <icon-edit class="icon" />
          </template>
        </app-input>
        <div class="select__dropdown-inner">
          <ul
            v-if="options.length"
            class="select__dropdown-list"
          >
            <li
              v-for="(item, index) in sortedOptions"
              :key="index"
              class="select__dropdown-item"
              :class="selectedClass(item)"
              @click="handleSelect(item)"
            >
              {{ item }}
            </li>
          </ul>
          <p
            v-else
            class="select__dropdown-placeholder"
          >
            Empty.
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.select {
  position: relative;

  &__label {
    margin-bottom: rem($gap-mini);

    color: $white;
  }

  &__face {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    min-height: rem($height-field);
    padding: rem(6px) rem($gap-mini);

    cursor: pointer;
    transition: border-color $transition-duration $transition-function;

    border: rem(1px) solid $mine-shaft-2;
    border-radius: rem($border-radius-micro);
    background-color: $mine-shaft-4;

    &--open {
      border-color: $white;
    }

    &-container {
      align-self: center;
      flex-grow: 1;
    }

    &-list {
      display: flex;
      flex-wrap: wrap;

      width: 100%;
      margin-bottom: rem(-$gap-mini);
    }

    &-item {
      @include text-size(14px, 16px);

      margin-right: rem($gap-mini);
      margin-bottom: rem($gap-mini);
      padding: rem($gap-micro) rem(6px);

      user-select: none;

      color: $white;
      border-radius: rem($border-radius-micro);

      &--blue {
        background-color: $boston-blue;
      }

      &--orange {
        background-color: $orange;
      }

      &--green {
        background-color: $green;
      }
    }

    &-placeholder {
      user-select: none;

      color: #777;
    }

    &-suffix {
      flex-shrink: 0;

      margin-top: rem(2px);
      margin-left: rem($gap-mini);
    }

    &-icon {
      color: $white;

      &--rotate {
        transform: rotate(180deg);
      }
    }
  }

  &__dropdown {
    position: absolute;
    z-index: $z-index-dropdown;
    top: calc(100% + 4px);
    right: 0;
    left: 0;

    overflow: hidden;

    border: rem(1px) solid $dove-gray;
    border-radius: rem($border-radius-micro);
    background-color: $mine-shaft-4;

    &-inner {
      overflow-y: auto;

      max-height: rem(240px);
    }

    &-item {
      padding: rem($gap-mini);

      cursor: pointer;
      user-select: none;
      transition: color $transition-duration $transition-function,
        background-color $transition-duration $transition-function;

      color: $white;

      &:not(#{&}--selected):hover {
        background-color: $dove-gray;
      }

      &--selected {
        color: $silver-chalice;
        background-color: darken($mine-shaft-4, 5%);
      }
    }

    &-placeholder {
      padding: rem($gap-mini);

      color: $white;
    }

    :deep(.field) {
      border-bottom: rem(1px) solid $dove-gray;
    }
  }
}

.face-value {
  display: flex;

  &__text {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }

  &__suffix {
    flex-shrink: 0;

    margin-left: rem($gap-micro);
  }
}
</style>
