//ios wkwebview返回不刷新问题
(function(){
    //页面卸载
    window.addEventListener('pagehide', function( e ){
        isPageHide = true;
    })
    //页面从缓存回到当前视图；页面第一次进入
    window.addEventListener('pageshow', function( e ){
        if(isPageHide) { 
            window.location.reload(); 
        }    
    })
}())
