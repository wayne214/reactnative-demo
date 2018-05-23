export const DEBUG = false; // process.env.NODE_ENV === 'development';

export const PAGE_SIZE = 10;

// 7rpCvcfAnSIotnBikrOoZG49B1tv3z9H
export const TOKEN = DEBUG ? '8aaa85b2fb864ac19e65ae389160d1ec' : '7rpCvcfAnSIotnBikrOoZG49B1tv3z9H';

export const HOST_TEST = 'http://carrier-mproxy-test.xianyiscm.com/'; // test地址

export const HOST_BEAT = 'http://carrier-mproxy-beta.xianyiscm.com/'; // beta地址

export const HOST = DEBUG ? HOST_TEST : 'http://carrier-mproxy.xianyiscm.com/';
// export const HOST = DEBUG ? 'http://192.168.33.4:8882/' : 'http://app-api.lenglianmajia.com/';
// export const HOST = DEBUG ? 'http://192.168.29.54:8086/' : 'http://app-api.lenglianmajia.com/';
// export const HOST = DEBUG ? 'http://192.168.32.237:8083/' : 'http://app-api.lenglianmajia.com/';
// export const HOST = DEBUG ? 'http://192.168.32.117:8081/' : 'http://app-api.lenglianmajia.com/';
// export const HOST = DEBUG ? 'http://192.168.33.48:8888/' : 'http://app-api.lenglianmajia.com/';
// export const HOST = DEBUG ? 'http://192.168.33.48:8888/' : 'http://app-api.lenglianmajia.com/';

export const IMG_HOST = DEBUG ? 'http://img-test.lenglianmajia.com/' : 'http://img.lenglianmajia.com/';
export const CONTRACT_HEADER = DEBUG ? 'http://order-contract-test.oss-cn-beijing.aliyuncs.com/' : 'http://file-contract.lenglianmajia.com/';// 合同地址前缀
export const CODE_HOST = DEBUG ? 'http://app-web-test.lenglianmajia.com/carrier/' : 'http://app-web.lenglianmajia.com/carrier/';
export const BASE_URL = DEBUG ? 'http://app-web-test.lenglianmajia.com/carrier/' : 'http://app-web.lenglianmajia.com/carrier/';//注册协议、关于我们、发票说明

export const CACHE_DATA_TIME = 24 * 60 * 60 * 1000;

// 承运商认证
export const OSS_CARRIER_AUTH = 'carrier_auth';
// 订单
export const OSS_ORDER = 'order';
// 结算相关
export const OSS_SETTLEMENT = 'settlement';

export const OSS_ADD_DRIVER = 'driver_license';

export const OSS_ADD_CAR = 'car';


export const CONTRACT_TEMPLATE_URL = DEBUG ? 'http://paas-web-test.xianyiscm.com/inf/template_carrier.pdf' : 'http://file.lenglianmajia.com/contract_template/template_carrier.pdf'

export const XYT_HOST = DEBUG ? 'http://mproxy-test.xianyiscm.com/' : 'http://mproxy.xianyiscm.com/';

export const WEB_SOCKET = DEBUG ? 'ws://mproxy-test.xianyiscm.com/' : 'ws://mproxy.xianyiscm.com/';

// 货主
// http://file.lenglianmajia.com/contract_template/template_goods.pdf

// 测试环境合同模板地址
// 承运商

// 货主
// http://file-test.lenglianmajia.com/contract_template/template_goods.pdf

export const HTTP_TIMEOUT = 30 * 1000

export const PHOTOREFNO = 'photoRefNo';
