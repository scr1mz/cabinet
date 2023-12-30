import { useRuntimeConfig } from 'nuxt/app';

const config = useRuntimeConfig();
const ordersUrl = '/method/orders.getTest';
type SearchParameters = Record<string, any>;

const query: SearchParameters = {};

if (import.meta.env.DEV && config.public.devToken) {
  query.dev_token = config.public.devToken;
}

export const internalAPIFetch = $fetch.create({ query });

// Запрос method/orders.getTest
export const getTestOrders = async (searchParams: SearchParameters) => {
  try {
    const response = await internalAPIFetch(ordersUrl, {
      params: searchParams,
    });
    // Преобразование строки JSON в объект
    const responseData = JSON.parse(response);
    // Проверка наличия свойства data в response
    if (responseData && typeof responseData === 'object' && 'data' in responseData.response) {
      return responseData.response.data.orders;
    }
    else {
      console.error('Response does not contain data:', response);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching test orders:', error);
    throw error;
  }
};


