<template>
  <div class="manager-orders">
    <div class="manager-orders__filter-block" style="padding: 16px;">
      <!-- Левая часть страницы -->
      <div class="block" style="padding: 16px;">
        <DateRange />
        <Search
          :searchQuery="state.searchQuery"
          :types="state.searchTypes"
          :selectedType="state.selectedType"
          @update:searchQuery="state.searchQuery = $event"
          @update:type="state.selectedType = $event"
          @submit="handleSearchSubmit"
          @refresh="refreshFilter"
        />
        <div class="filter-block__sort-buttons">
          <myButton
            v-for="button in sortButtons"
            :key="button.value"
            :size="'small'"
            :color="button.value === activeSort ? 'light-purple' : 'purple-reverse'"
            :class="{ active: button.value === activeSort, 'sort-button': true,
             'icon-button': button.mode === 'icon' } "
            :isIcon="button.isIcon"
            @click="handleSort(button.value)"
          >
            <i v-if="button.mode === 'icon'" :class="[button.classIcon || 'default-icon-class', 'button-icon']"></i>
            <span v-if="button.mode === 'text'">{{ button.label }}</span>
          </myButton>
        </div>
      </div>

      <div class="block">
        <Select :options="yearOptions" v-model="selectedYear" @change="handleYearChange" />
      </div>
    </div>

    <!-- Правая часть страницы -->
    <div class="manager-orders__orders-block" style="padding: 16px;">
      <template v-if="state.loading">
        <LoadingSpinner />
      </template>
      <template v-else>
        <StatusCard v-for="order in state.orders" :key="order.id" :order="order"/>
      </template>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { getTestOrders } from "../../../api/internal/instance";
import { DateRange } from "../../../ui/date-range/index";
import { StatusCard } from "../../../ui/status-card/index";
import { Search } from "../../../components/shared/search/index";
import { myButton } from "../../../ui/button/index"

export default {
  components: {
    DateRange, Search, StatusCard, myButton,
  },
  setup() {
    const router = useRouter();

    const state = reactive({
      orders: [],
      loading: true,
      searchQuery: "",
      selectedType: "",
      searchTypes: {
        id: { title: "Номер заказа", placeholder: "Введите номер" },
        psid: { title: "Номер фотосессии", placeholder: "Введите номер" },
        uid: { title: "Клиент ID", placeholder: "Введите ID клиента" },
        phone: { title: "Телефон", placeholder: "Введите номер телефона" },
        email: { title: "Email", placeholder: "Введите email" },
      },
    });

    const activeSort = ref("All");

    const sortButtons = [
      { label: 'Все', value: 'All', isIcon: false, mode: 'text', classIcon: '' },
      { label: 'ID↑', value: 'idAsс', isIcon: true, mode: 'text', classIcon: 'fa fa-thumbs-o-up' },
      { label: 'ID↓', value: 'idDesc', isIcon: false, mode: 'text', classIcon: '' },
      { label: '3', value: 'sort3', isIcon: false, mode: 'text', classIcon: '' },
      { label: '4', value: 'sort4', isIcon: false, mode: 'text', classIcon: '' },
      { label: '5', value: 'sort5', isIcon: false, mode: 'text', classIcon: '' },
      { label: '6', value: 'sort6', isIcon: false, mode: 'text', classIcon: '' },
      { label: '7', value: 'sort7', isIcon: false, mode: 'text', classIcon: '' },
    ];

    const fetchOrders = async () => {
      const searchType = router.currentRoute.value.query.search_type || "";
      const searchValue = router.currentRoute.value.query.search_value || "";
      try {
        console.log('Search Type:', searchType);
        console.log('Search Value:', searchValue);
        state.orders = await getTestOrders({
          searchType: searchValue
        });
        state.loading = false; // Данные загружены
        console.log(state.orders);
      } catch (error) {
        console.error('Ошибка при запросе заказов', error);
        state.loading = false; // Произошла ошибка при загрузке
      }
    };

    const applyFilter = () => {
      const searchType = router.currentRoute.value.query.search_type || "";
      const searchValue = router.currentRoute.value.query.search_value || "";
      if (searchType && searchValue) {
        state.orders = state.orders.filter(order => order[searchType] === searchValue);
      }
    };

    const refreshFilter = () => {
      console.log('refresh');
      router.push({ path: '/manager/orders' }).catch(err => console.error(err));
      fetchOrders();
    };

    const handleSort = (value) => {
      activeSort.value = value;
      // Дополнительная логика сортировки (пример для id по возрастанию/убыванию)
      if (value === 'idAsc') {
        console.log('Sorting by:', value);
        // Сортировка по возрастанию ID
        state.orders.sort((a, b) => a.id - b.id);
      }
      if (value === 'idDesc') {
        // Сортировка по убыванию ID
        state.orders.sort((a, b) => b.id - a.id);
      }
    };

    onMounted(() => {
      // Извлечение параметров запроса из URL
      const { query } = router.currentRoute.value;
      state.searchQuery = query.searchQuery || "";
      state.selectedType = query.type || "";
      fetchOrders();
    });

    const handleSearchSubmit = async () => {
      console.log("Search submitted", state.searchQuery, state.selectedType);
      const query = {};
      // Обновление параметров запроса URL при сабмите формы
      if (state.searchQuery) {
        query.search_value = state.searchQuery;
      }
      if (state.selectedType) {
        query.search_type = state.selectedType;
      }
      await router.push({
        path: '/manager/orders',
        query: {
          search_type: state.selectedType,
          search_value: state.searchQuery,
        },
      }).catch(err => console.error(err));
      applyFilter();
    };

    return { state, sortButtons, activeSort, handleSearchSubmit, applyFilter, refreshFilter, handleSort };
  },
};
</script>

<style scoped>
@import "/assets/styles/main.scss";
@import "/assets/styles/pages/manager/orders/orders-page.scss"
</style>
