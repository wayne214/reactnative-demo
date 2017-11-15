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
		console.log('异步读文件出错 ',err);
		return;
	}
	const configData = JSON.parse(configdata);

	configData.build_ios = '' + m + d + h + M;

	const newconfigData = JSON.stringify(configData, null, 2);

	FS.writeFileSync(targetPath,newconfigData)

	console.log('准备发布热更新，更新build_ios号\nbuild_ios=',configData.build_ios);
});





// // FS.exists(targetPath, function (exists) {
// //   console.log(exists ? "it's there" : "no file!");
// // });

// FS.open(targetPath, 'w+', '0666',function (err, fd){
// 	if (err) {
// 		return console.error(err);
// 	}
// 	console.log("文件打开成功！",fd);


// 	// FS.readFile(targetPath,'utf8',function (err, configdata) {
// 	// 	if(err) {
// 	// 		console.log(err);
// 	// 		// FS.close(fd, function(err){
// 	// 		// 	if (err){console.log(err)}
// 	// 		// 	console.log("文件提前关闭成功");
// 	// 		// });
// 	// 		return;
// 	// 	}
// 		console.log(" --- 文件内容 ",fd.toString());
// 		const configData = fd.toString() ? JSON.parse(fd.toString()) : {};
// 		configData.build_ios = '' + m + d + h + M;
// 		const newconfigData = JSON.stringify(configData, null, 2);
// 		FS.writeFileSync(targetPath,newconfigData)
// 		console.log('准备发布更新，更新build_ios号\nbuild_ios=',configData.build_ios);
// 		FS.close(fd, function(err){
// 			if (err){console.log(err)}
// 			console.log("文件关闭成功");
// 		});

// 	// });
// })




// FS.open(targetPath, 'w+', '0666',function (err, fd){
// 	if (err) {
// 		return console.error(err);
// 	}
// 	console.log("文件打开成功！",fd);
// 	const jsonData = FS.readFileSync(targetPath)
// 	console.log(" === >  get json data ",jsonData.toString());

// 	const configData = jsonData.toString() ? JSON.parse(jsonData) : {};
// 	configData.build_ios = '' + m + d + h + M;
// 	const newconfigData = JSON.stringify(configData, null, 2);
// 	FS.writeFileSync(targetPath,newconfigData)

// 	console.log('准备发布更新，更新build_ios号\nbuild_ios=',configData.build_ios);
// 	FS.close(fd, function(err){
// 		if (err){
// 		  console.log(err);
// 		}
// 		console.log("文件关闭成功");
// 	});
// })
