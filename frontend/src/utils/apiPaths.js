// BASE URL
export const BASE_URL = 'http://localhost:5000';

export const API_PATHS = {
  AUTH: {
    LOGIN: (type) => `/api/${type}/login`,
    LOGOUT: (type) => `/api/${type}/logout`,
  },

  ADMIN: {
    REGISTER: '/api/admin/register',

    // SALESMAN
    SALESMAN: {
      ADD: '/api/admin/add_salesman',
      GET_ALL: '/api/admin/get_allSalesman',
      GET: (id) => `/api/admin/get_salesman/${id}`,
      UPDATE: (id) => `/api/admin/update_salesman/${id}`,
      DELETE: (id) => `/api/admin/delete_salesman/${id}`,
    },

    // SALES MANAGER
    SALESMANAGER: {
      ADD: '/api/admin/add_salesmanager',
      GET_ALL: '/api/admin/get_allsalesmanager',
      GET: (id) => `/api/admin/get_salesmanager/${id}`,
      UPDATE: (id) => `/api/admin/update_salesmanager/${id}`,
      DELETE: (id) => `/api/admin/delete_salesmanager/${id}`,
    },

    // SALES AUTHORIZER
    SALESAUTHORIZER: {
      ADD: '/api/admin/add_salesauthorizer',
      GET_ALL: '/api/admin/get_allsalesauthorizer',
      GET: (id) => `/api/admin/get_salesauthorizer/${id}`,
      UPDATE: (id) => `/api/admin/update_salesauthorizer/${id}`,
      DELETE: (id) => `/api/admin/delete_salesauthorizer/${id}`,
    },

    // PLANT HEAD
    PLANTHEAD: {
      ADD: '/api/admin/add_planthead',
      GET_ALL: '/api/admin/get_allplantheads',
      GET: (id) => `/api/admin/get_planthead/${id}`,
      UPDATE: (id) => `/api/admin/update_planthead/${id}`,
      DELETE: (id) => `/api/admin/delete_planthead/${id}`,
    },

    // ACCOUNTANT
    ACCOUNTANT: {
      ADD: '/api/admin/add_accountant',
      GET_ALL: '/api/admin/get_allaccountants',
      GET: (id) => `/api/admin/get_accountant/${id}`,
      UPDATE: (id) => `/api/admin/update_accountant/${id}`,
      DELETE: (id) => `/api/admin/delete_accountant/${id}`,
    },

    // WAREHOUSE
    WAREHOUSE: {
      ADD: '/api/admin/add_warehouse',
      GET_ALL: '/api/admin/get_allwarehouse',
      GET: (id) => `/api/admin/get_warehouse/${id}`,
      UPDATE: (id) => `/api/admin/update_warehouse/${id}`,
      DELETE: (id) => `/api/admin/delete_warehouse/${id}`,
      APPROVE: '/api/admin/approve_warehouse',
      UPDATE_PRODUCTS: (id) => `/api/admin/update_products/${id}`,
    },

    // ORDER MANAGEMENT
    ORDERS: {
      GET_TO_APPROVE: '/api/admin/get_orders_to_approve',
      GET_ALL: '/api/admin/get_allorder',
      GET: (id) => `/api/admin/get_order/${id}`,
      CANCEL: (id) => `/api/admin/cancel_order/${id}`,
    },
  },

  SALESMAN: {
    CREATE_ORDER: '/api/salesman/create_order',
    DELETE_ORDER: (orderId) => `/api/salesman/delete_order/${orderId}`,
    GET_ALL_ORDERS: '/api/salesman/get_allorder',
    GET_ORDER: (orderId) => `/api/salesman/orders/${orderId}`,
    GET_DUE_ORDERS: '/api/salesman/orders/due',
    PAY_ORDER: (orderId) => `/api/salesman/orders/pay/${orderId}`,
  },

  MANAGER: {
    GET_ASSIGNED_ORDERS: (managerId) => `/api/manager/orders/${managerId}`,
    FORWARD_ORDER: (orderId) => `/api/manager/forward/${orderId}`,
  },

  AUTHORIZER: {
    GET_ASSIGNED_ORDERS: (authorizerId) => `/api/authorizer/orders/${authorizerId}`,
    GET_ORDER_DETAIL: (orderId) => `/api/authorizer/order/${orderId}`,
    ASSIGN_WAREHOUSE: (orderId) => `/api/authorizer/assign-warehouse/${orderId}`,
    GET_HISTORY: (authorizerId) => `/api/authorizer/history/${authorizerId}`,
    CHECK_WAREHOUSE_STATUS: (orderId) => `/api/authorizer/warehouse-status/${orderId}`,
  },

  PLANT_HEAD: {
    UPDATE_STOCK: '/api/planthead/production',
    GET_PRODUCTION_CHART: '/api/planthead/production/chart',
    DISPATCH_ORDER: (orderId) => `/api/planthead/dispatch/${orderId}`,
    UPLOAD_TRANSPORT: (orderId) => `/api/planthead/transport/${orderId}`,
  },

  ACCOUNTANT: {
    GET_DISPATCHED_ORDERS: '/api/accountant/dispatched-orders',
    GENERATE_INVOICE: (orderId) => `/api/accountant/generate-invoice/${orderId}`,
    GET_INVOICE: (orderId) => `/api/accountant/invoice/${orderId}`,
  },
};
