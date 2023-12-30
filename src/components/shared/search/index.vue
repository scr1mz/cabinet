<template>
  <form class="search" @submit.prevent="submitForm">
    <div class="search__data">
      <div class="search__select-trigger">
        <Select v-model="type" :items="selectItems" name="searchBy" theme="solid"/>
      </div>

      <div class="search__input-wrapper">
        <input v-model="searchQuery" class="search__input" :placeholder="type ? props.types[type].placeholder : ''" />
        <button v-if="searchQuery" type="button" class="search__clear" @click="handleClearClicked">
          <i class="icon icon-xmark" />
        </button>
      </div>
    </div>

    <button type="submit" class="search__submit">
      <i class="icon icon-search" />
    </button>
  </form>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Object } from "core-js"

import { Select } from "~/ui/select";
import type { SelectItems } from "~/ui/select/types";


const props = defineProps(["searchQuery", "types", "selectedType"]);

const emit = defineEmits(["update:searchQuery", "update:type", "submit", "refresh"]);

const searchQuery = ref(props.searchQuery);
const type = ref(props.selectedType);

const handleClearClicked = () => {
  searchQuery.value = "";
  type.value = "";
  emit("update:searchQuery", searchQuery.value);
  emit("refresh");
};

const selectItems: ref<SelectItems> = computed(() => {
  return Object.keys(props.types).map(type => {
    return { value: type, title: props.types[type].title };
  });
});

const submitForm = () => {
  console.log(searchQuery.value, type.value);
  emit("update:searchQuery", searchQuery.value);
  emit("update:type", type.value);
  emit("submit");
};
</script>

<style lang="scss">
@import "~/assets/styles/components/search.scss";
</style>
