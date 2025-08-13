window.addEventListener('pageshow', function(event) {
    if (event.persisted) { // 如果页面来自缓存
        const btn = document.querySelector('.btn');
        
        btn.classList.remove("btn");
        void btn.offsetWidth;
        btn.classList.add("btn");

    }
});