import AddressJson from '../../assets/json/address.json';

class AddressHandler {

	set(datas) {
		this.datas = datas;
	}

	getCityOfCountry(unlimit) {
		const dataSource = this.datas.map((item1)=>{
			const obj1 = {};
			const key1 = item1.regionName;
			const obj2 = [];
			obj2.push({ '不限': ['不限'] });
			item1.childList.map((item2) => {
				const key2 = item2.regionName;
				const districtArr = ['不限'];
				if (item2.childList) {
					item2.childList.map((item3) => {
						districtArr.push(item3.regionName);
					})
					const temp = {};
					temp[item2.regionName] = districtArr;
					obj2.push(temp);
				} else {
					console.log(`${item2.regionName}地址信息有异常 rl 数据${item2.rl}`);
				}
			})
			obj1[key1] = obj2;
			return obj1;
		})
		if (unlimit) {
			dataSource.unshift({'不限':
				[
					{'不限':
						['不限']
					}
				]
			})
		}
		return dataSource
	}

	getPIDWithPName(pName){
		if (pName === '不限') return '';
		let PID;
		this.datas.map((item1) => {
			if (item1.regionName === pName) {
				PID = item1.regionId;
			};
		})
		return PID;
	}

	getCIDWithCName(cName){
		if (cName === '不限') return '';
		let CID;
		this.datas.map((item1) => {
			item1.childList.map((item2) => {
				if (item2.regionName === cName) {
					CID = item2.regionId;
				};
			})
		})
		return CID;
	}

	getAIDWithAName(cName,aName){
		if (aName === '不限') return '';
		let AID;
		this.datas.map((item1) => {
			item1.childList.map((item2) => {
				if (item2.regionName === cName) {
					console.log("---- cName",item2);
					item2.childList.map((item3) => {
						if(item3.regionName === aName){
							AID = item3.regionId;
						}
					})
				}
			})
		})
		return AID;
	}

}

export default new AddressHandler();