
class AddressHandler {

	set(datas) {
		// console.log('AddressHandler---',datas);
		let oneItemArr = [];
		for(var i = 0;i < datas.length;i++){
			let oneLevelItem = datas[i];
			let oneLevelId = oneLevelItem.id;
			if(oneLevelItem.level === 1){//表示 省
				let twoItemArr = [];
				for(var j = 0;j < datas.length;j++){
					let twoLevelItem = datas[j];
					let twoLevelPId = twoLevelItem.pId;
					let twoLevelId = twoLevelItem.id;

					if(twoLevelItem.level === 2 &&  twoLevelPId === oneLevelId){
							let threeItemArr = [];
							for(var k = 0;k < datas.length;k++){
								let threeLevelItem = datas[k];
								let threeLevelPId = threeLevelItem.pId;
								let threeLevelId = threeLevelItem.id;
								if(threeLevelItem.level === 3 &&  threeLevelPId === twoLevelId){
									let threeItem = {'regionId': threeLevelId ,'regionName': threeLevelItem.name ,'parentId': threeLevelItem.pId,'childList': [] };
									threeItemArr.push(threeItem);
								}
							}
							let twoItem = {'regionId': twoLevelId ,'regionName': twoLevelItem.name ,'parentId': twoLevelItem.pId,'childList': threeItemArr };
							twoItemArr.push(twoItem);
					}

				}
				let oneItem = {'regionId': oneLevelId ,'regionName': oneLevelItem.name ,'parentId': oneLevelItem.pId,'childList': twoItemArr };
				oneItemArr.push(oneItem);
			}

		}
		// console.log('AddressHandler-oneItemArr--',oneItemArr);
		this.datas = oneItemArr;
	}

	getCityOfCountry(unlimit) {
		if(!this.datas) return;
		const dataSource = this.datas.map((item1)=>{
			const obj1 = {};
			const key1 = item1.regionName;
			const obj2 = [];
			// obj2.push({ '不限': ['不限'] });
			item1.childList.map((item2) => {
				const key2 = item2.regionName;
				// const districtArr = ['不限'];
				const districtArr = []
				if (item2.childList) {
					item2.childList.map((item3) => {
						districtArr.push(item3.regionName);
					})
					const temp = {};
					if(districtArr && districtArr.length>0){
						temp[item2.regionName] = districtArr;
					}else{
						temp[item2.regionName] = ['暂无'];
					}
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
				console.log('AddressHandler-dataSource--',dataSource);
		return dataSource
	}

	getPIDWithPName(pName){
		if (pName === '不限' || !pName) return '';
		let PID;
		this.datas.map((item1) => {
			if (item1.regionName === pName) {
				PID = item1.regionId;
			};
		})
		return PID;
	}

	getCIDWithCName(cName){
		if (cName === '不限' || !cName) return '';
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
		if (aName === '不限' || !aName) return '';
		let AID;
		this.datas.map((item1) => {
			item1.childList.map((item2) => {
				if (item2.regionName === cName) {
					item2.childList.map((item3) => {
						if(item3.regionName === aName){
							AID = item3.regionId;
						}
					})
				};

			})
		})
		return AID;
	}

}

export default new AddressHandler();
