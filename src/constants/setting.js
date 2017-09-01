
export const DEBUG = true // process.env.NODE_ENV === 'development';

export const PAGE_SIZE = 10;
// 7rpCvcfAnSIotnBikrOoZG49B1tv3z9H
export const TOKEN = DEBUG ? '8aaa85b2fb864ac19e65ae389160d1ec' : '7rpCvcfAnSIotnBikrOoZG49B1tv3z9H';
// export const HOST = DEBUG ? 'http://192.168.29.63:8086/' : 'http://app-api.lenglianmajia.com/';

export const HOST = DEBUG ? 'http://app-api-test.lenglianmajia.com/' : 'http://app-api.lenglianmajia.com/';
export const IMG_HOST = DEBUG ? 'http://img-test.lenglianmajia.com/' : 'http://img.lenglianmajia.com/';
export const CONTRACT_HEADER = DEBUG ? 'http://file-contract-test.lenglianmajia.com' : 'http://file-contract.lenglianmajia.com/';// 合同地址前缀
export const CODE_HOST = DEBUG ? 'http://app-web-test.lenglianmajia.com/' : 'http://app-web.lenglianmajia.com/';
export const BASE_URL = DEBUG ? 'http://app-web-test.lenglianmajia.com/' : 'http://app-web.lenglianmajia.com/';//关于我们


export const HOST_OLD = DEBUG ? 'http://192.168.26.99:8080/' : 'http://m.lenglianmajia.com/';

export const CACHE_DATA_TIME = 24 * 60 * 60 * 1000;

// 承运方认证
export const OSS_CARRIER_AUTH = 'carrier_auth';
// 订单
export const OSS_ORDER = 'order';
// 结算相关
export const OSS_SETTLEMENT = 'settlement';

export const OSS_ADD_DRIVER = 'driver_license';

export const OSS_ADD_CAR = 'car';

export const HTTP_TIMEOUT = 10 * 1000;

export const HOT_LINE = '400-663-5656'

export const CONTRACT_TEMPLATE_URL = DEBUG ? 'http://file-test.lenglianmajia.com/contract_template/template_goods.pdf' : 'http://file.lenglianmajia.com/contract_template/template_goods.pdf'
