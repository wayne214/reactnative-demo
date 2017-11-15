'use strict'

const FS = require('fs');
const path = require('path');
const targetPath  = path.resolve()+'/app.json'
const newDate = new Date()
const m = newDate.getMonth()+1;
const d = newDate.getDate();
const h = newDate.getHours();
const M = newDate.getMinutes();

FS.readFile(targetPath,'utf8',function (err, configdata) {
	if(err) {
		console.log(err);
		return;
	}
	const configData = JSON.parse(configdata);

	configData.build_and = '' + m + d + h + M;

	const newconfigData = JSON.stringify(configData, null, 2);

	FS.writeFileSync(targetPath,newconfigData)

	console.log('准备发布热更新，更新build_and号\nbuild_and=',configData.build_and);
});