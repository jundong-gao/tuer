function time(){
    var currentTime = new Date()

    var year = currentTime.getFullYear()
    var date = currentTime.getDate()
    var month = currentTime.getMonth()


    var mubiao = new Date(year,month,date,24,00,00).getTime()

    var dangqian = currentTime.getTime()

    var cha = mubiao - dangqian;

    var s = Math.ceil(cha / 1000 % 60) - 1;
    var m =Math.floor(cha / 1000 / 60 % 60) 
    var h =Math.floor(cha / 1000 / 60 / 60 % 60) 
    // console.log('秒',s)
    // console.log('分',m)
    // console.log('时',h)
    document.getElementById('time').innerHTML ='距离明天还有：'  +  h + '小时' + m + '分钟' ;
    return {
        h : h,
        m : m,
        s : s
    }
}

setInterval(time,1000)