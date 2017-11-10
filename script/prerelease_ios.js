'use strict'

const FS = require('fs');
const path = require('path');
const targetPath  = path.resolve()+'/app.json'

FS.readFile(targetPath,'utf8',function (err, configdata) {
	if(err) {
		console.log(err);
		return;
	}
	const configData = JSON.parse(configdata);

	configData.build_ios = 0;

	const newconfigData = JSON.stringify(configData, null, 2);

	FS.writeFileSync(targetPath,newconfigData)

	console.log('准备打包，清空build_ios号\nbuild_ios=',configData.build_ios);

	return;
});