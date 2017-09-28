/**
 * Created by mymac on 2017/7/19.
 */

import React, { Component } from 'react';
import {
    View,
    NativeModules,
    NativeAppEventEmitter,//导入
} from 'react-native';

import {upLoadImageManager} from './upLoadImageToVerified.js';
import ReadAndWriteFileUtil from './readAndWriteFileUtil';
import * as API from '../constants/api';
import {XYT_HOST} from '../constants/setting'

/*向原生发送消息*/
const sendMsgToNative = () => {
    NativeModules.NativeModule.RNSendMsgToNative()
};
/*接收从原生传过来的数据*/
const receiveMsgFromNative = (data)=> {
    console.log('接收到数据，即将进行存储本地操作');
};

const upLoadLogger = () => {
    //console.log('10秒钟调用一次');
    ReadAndWriteFileUtil.mkDir(()=>{
        ReadAndWriteFileUtil.deleteFile(); // 如果目录存在就删除
        ReadAndWriteFileUtil.copyFile(() => {
            console.log('日志拷贝成功');
            ReadAndWriteFileUtil.writeFile(); // 清空原文件
            let formData = new FormData();
            let file = {uri: ReadAndWriteFileUtil.getPath(), type: 'multipart/form-data', name: 'logger.txt'};
            formData.append('logFile', file);
            const url = XYT_HOST + API.API_COLLECT_LOG;
            ReadAndWriteFileUtil.isFilePathExists((exist)=>{
                if (exist) {
                    upLoadImageManager(url,
                        formData,
                        () => {
                            console.log('开始上传日志');
                        },
                        (response) => {
                            console.log('responseData', response);
                            if (response.code === 200) {
                                console.log('日志上传成功',new Date());
                            }
                            ReadAndWriteFileUtil.deleteFile(); // 上传成功后删除目的文件
                        },
                        (error) => {
                            console.log('服务器连接失败', error);
                            ReadAndWriteFileUtil.deleteFile(); // 上传成功后删除目的文件
                        });
                }else{

                }

            })

        }); // 拷贝文件
    });


};
/* 上传本地的数据到服务器*/
const uploadDataFromLocalMsg = (data)=>{
    // console.log('接收到数据，即将进行上传操作');
    upLoadLogger();
};

export default {
    sendMsgToNative,
    receiveMsgFromNative,
    uploadDataFromLocalMsg,
};
