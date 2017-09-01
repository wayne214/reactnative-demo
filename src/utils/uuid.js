/**
 * [getUUID description]
 * 		模拟生成UUI，格则任意
 * @return {[type]} [description]
 *       eg:602a20f4-c40a-40e8-99b5-cfcad753c8e7
 */
export default function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		let random = Math.random()*16|0, v = c == 'x' ? random : (random&0x3|0x8);
		return v.toString(16);
	});
}