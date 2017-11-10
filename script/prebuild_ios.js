'use strict'

const FS = require('fs');
const path = require('path');
const AppJson = require('../app.json')
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

	configData.build_ios = '' + m + d + h + M;

	const newconfigData = JSON.stringify(configData, null, 2);

	FS.writeFileSync(targetPath,newconfigData)

	console.log('准备发布更新，更新build_ios号\nbuild_ios=',configData.build_ios);

	return;
});