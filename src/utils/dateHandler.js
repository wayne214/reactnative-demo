class DateHandler {
    createDateData(minDateArray,maxDateArray){
        let date = [];

        const nowTime = new Date();
        let minYear =  nowTime.getFullYear();
        let minMonth = nowTime.getMonth();
        let minDay = nowTime.getDate();

        if (minDateArray && minDateArray.length == 3) {
            minYear = parseInt(minDateArray[0]);
            if (parseInt(minDateArray[1]) > 0) {
                minMonth = parseInt(minDateArray[1])-1;
            }
            minDay = parseInt(minDateArray[2]);
        };
        // let maxYear = maxDateArray[0]
        // let maxMonth = maxDateArray[1]
        // let maxDay = maxDateArray[2]
        // if (minYear > maxYear) {console.error("minYear > maxYear");return []}
        // if (maxDateArray && maxDateArray.length == 3) {

        // };
        for(let i=minYear;i<2080;i++){
            let month = [];
            if (i === minYear) {
                for(let j = minMonth + 1;j<13;j++){
                    let day = [];
                    if (j == minMonth + 1) {
                        if(j === 2){
                            for(let k=minDay;k<29;k++){
                                day.push(k+'日');
                            }
                            if((i%4 === 0 && i%100 != 0) || i%400 === 0 )  {
                                day.push(29+'日');
                            }
                        }else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                            for(let k=minDay;k<32;k++){
                                day.push(k+'日');
                            }
                        }else{
                            for(let k=minDay;k<31;k++){
                                day.push(k+'日');
                            }
                        }
                    }else{
                        if(j === 2){
                            for(let k=1;k<29;k++){
                                day.push(k+'日');
                            }
                            if((i%4 === 0 && i%100 != 0) || i%400 === 0 )  {
                                day.push(29+'日');
                            }
                        }
                        else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                            for(let k=1;k<32;k++){
                                day.push(k+'日');
                            }
                        }
                        else{
                            for(let k=1;k<31;k++){
                                day.push(k+'日');
                            }
                        }
                    }
                    let _month = {};
                    _month[j+'月'] = day;
                    month.push(_month);
                }
            }else{
                for(let j = 1;j<13;j++){
                    let day = [];
                    if(j === 2){
                        for(let k=1;k<29;k++){
                            day.push(k+'日');
                        }
                        if((i%4 === 0 && i%100 != 0) || i%400 === 0 )  {
                            day.push(29+'日');
                        }
                    }
                    else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                        for(let k=1;k<32;k++){
                            day.push(k+'日');
                        }
                    }
                    else{
                        for(let k=1;k<31;k++){
                            day.push(k+'日');
                        }
                    }
                    let _month = {};
                    _month[j+'月'] = day;
                    month.push(_month);
                }
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    }

    dateNumberFormat = (date) => {
        date = date.replace('年','').replace('月','').replace('日','');
        if (date.indexOf('-') != -1) {
            const arr = date.split('-');
            if (arr[1].length == 1) {
                arr[1] = `0${arr[1]}`;
            }
            if (arr[2].length == 1) {
                arr[2] = `0${arr[2]}`;
            };
            date = arr.join('-');
        };
        return date;
    }

    createInstallStartTimeData(selectedDay){
        const nowTime = new Date();
        const d1 = nowTime.getFullYear()
        const d2 = nowTime.getMonth() + 1
        const d3 = nowTime.getDate()
        const currentDay = d1 + '-' + (d2 < 10 ? '0'+d2 : d2) + '-' + (d3 < 10 ? '0'+d3 : d3)
        let timeData = [];

        let currentHour = nowTime.getHours()
        let currentMin = nowTime.getMinutes()
        if (selectedDay != currentDay) {
            currentHour = 0
            currentMin = 0
        }
        for (let i = currentHour; i < 24; i++) {
            const minute = []
            if (i == currentHour) {
                for (let i = currentMin; i < 60; i++) {
                    minute.push((i < 10 ? '0' : '') + parseInt(i) +'分')
                };
            }else{
                for (let i = 0; i < 60; i++) {
                    minute.push((i < 10 ? '0' : '') + parseInt(i) +'分')
                };
            }
            const obj = {}
            obj[(i < 10 ? '0' : '') + parseInt(i) + '时'] = minute

            timeData.push(obj)
        };
        return timeData
    }

    // createInstallEndTimeData(selectedDay,selectedDay2,selectedTime){
    //     let timeData = [];
    //     // if (selectedDay == selectedDay2) {
    //     //     // currentHour = parseInt(selectedTime.split(':')[0])
    //     //     // currentMin = parseInt(selectedTime.split(':')[1])
    //     // }else{
    //         let currentHour = 0
    //         let currentMin = 0
    //     // }

    //     for (let i = currentHour; i < 24; i++) {
    //         const minute = []
    //         if (i == currentHour) {
    //             for (let i = currentMin; i < 60; i++) {
    //                 minute.push((i < 10 ? '0' : '') + parseInt(i) +'分')
    //             };
    //         }else{
    //             for (let i = 0; i < 60; i++) {
    //                 minute.push((i < 10 ? '0' : '') + parseInt(i) +'分')
    //             };
    //         }
    //         const obj = {}
    //         obj[(i < 10 ? '0' : '') + parseInt(i) + '时'] = minute
    //         timeData.push(obj)
    //     };
    //     return timeData
    // }

    createTimeData(start,end){
        let timeData = [];
        if (start) {
            const minHour = start.split(':')[0]
            const minMin = start.split(':')[1]
            for (let i = minHour; i < 24; i++) {
                const minute = []
                if (i == minHour) {
                    for (let i = minMin; i < 60; i++) {
                        minute.push((i < 10 ? '0' : '') + parseInt(i) +'分')
                    };
                }else{
                    for (let i = 0; i < 60; i++) {
                        minute.push((i < 10 ? '0' : '') + parseInt(i) +'分')
                    };
                }
                const obj = {}
                obj[(i < 10 ? '0' : '') + parseInt(i) + '时'] = minute
                timeData.push(obj)
            };
            return timeData
        } else if (end) {
            const maxHour = end.split(':')[0]
            const maxMin = end.split(':')[1]
            for (let i = 0; i < parseInt(maxHour) + 1; i++) {
                const minute = []
                if (i != maxHour) {
                    for (let i = 0; i < 60; i++) {
                        const am = (i < 10 ? '0' : '') + parseInt(i) +'分'
                        minute.push(am)
                    };
                } else {

                    for (let i = 0; i < parseInt(maxMin) + 1; i++) {
                        const bm = (i < 10 ? '0' : '') + parseInt(i) +'分'
                        minute.push(bm)
                    };
                }
                const obj = {}
                const ah = (i < 10 ? '0' : '') + parseInt(i) + '时'
                obj[ah] = minute
                timeData.push(obj)
            };
            return timeData
        }
    }
}

export default new DateHandler();
