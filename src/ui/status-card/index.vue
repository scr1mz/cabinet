<template>
  <div v-if="order.id" class="block status-card" :data-status="statusColor">
    <div class="status-card__top-block">
      <div class="status-card__order-info status-card_block">
        <p>№: {{ order.id }}</p>
        <p class="client-id">Клиент ID: {{ order.client }}</p>
      </div>
      <div class="status-card__payment-info status-card_block">
        <p>Сумма: {{ order.sum }}</p>
        <p :data-status="status">
          Статус: {{ order.status === '1' ? 'Оплачен' :
          (order.status === '2' ? 'Не оплачен' : 'В обработке') }}
        </p>
      </div>
      <div class="status-card__date-info status-card_block">
        <p>
          {{ order.status == 1 ? 'Оплачен' :
          (order.status == 2 ? 'Не оплачен' : 'В обработке') }}
        </p>
        <p>Создан: {{ order.c_date }}</p>
      </div>
    </div>
      <div class="status-card__additional-info status-card_block">
        <p>Фотосессия ID: <span>{{ order.psid}}</span></p>
        <p>Статус: <span>{{ order.closed == 0 ? 'Открыта' : 'Закрыта' }}</span></p>
        <p>{{ order.type_data }}: <span>{{ order.value }}</span></p>
        <p>Ребенок: <span>{{ order.fi_child }}</span></p>
        <p>Телефон: <span>{{ order.phone }}</span></p>
      </div>
  </div>
  <div v-else>
    Order ID не доступен.
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusColor() {
      const statusMapping = {
        1: "green",
        2: "",
        7: "yellow"
      };

      let numericStatus;
      if (typeof this.order.status === 'string') {
        numericStatus = parseInt(this.order.status, 10);
      } else if (typeof this.order.status === 'number') {
        numericStatus = this.order.status;
      }

      if (Object.prototype.hasOwnProperty.call(statusMapping, numericStatus)) {
        return statusMapping[numericStatus];
      } else {
        console.error('Invalid value for "status" property.');
        return '';
      }
    },
  },
};
</script>

<style>
@import "~/assets/styles/components/status-card.scss";
</style>
