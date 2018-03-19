
class TimeUtil {
    resetTime(time){
        var timer=null;
        var t=time;
        var m=0;
        var s=0;
        m=Math.floor(t/60%60);
        m<10&&(m='0'+m);
        s=Math.floor(t%60);
        this.countDown(s, m, timer);
        // function countDown(){
        //     s--;
        //     s<10&&(s='0'+s);
        //     if(s.length>=3){
        //         s=59;
        //         m="0"+(Number(m)-1);
        //     }
        //     if(m.length>=3){
        //         m='00';
        //         s='00';
        //         clearInterval(timer);
        //     }
        //     console.log(m+"分钟"+s+"秒");
        //     return m+"分钟"+s+"秒";
        // }
    }

    countDown(s, m, timer){
        s--;
        s<10&&(s='0'+s);
        if(s.length>=3){
            s=59;
            m="0"+(Number(m)-1);
        }
        if(m.length>=3){
            m='00';
            s='00';
            clearInterval(timer);
        }
        console.log(m+"分钟"+s+"秒");
        return m+"分钟"+s+"秒";
    }
};

export default new TimeUtil();

