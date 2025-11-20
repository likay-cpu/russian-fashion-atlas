document.addEventListener('DOMContentLoaded', function () {

    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    //  для изменения шапки и кнопки вверх
    const siteHeader = document.querySelector('.site-header');
    const backToTopButton = document.getElementById('back-to-top-btn');

    window.onscroll = function () {
        let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollPosition > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
        if (scrollPosition > 200) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

 

    //  попап-окна с брендами
    const brandsPopupBtn = document.getElementById('brands-popup-btn');
    const brandsPopup = document.getElementById('brands-popup');
    const brandsPopupClose = document.getElementById('brands-popup-close');

   
    brandsPopupBtn.addEventListener('click', function (e) {
        e.stopPropagation(); 
        brandsPopup.style.display = 'flex';
       
        setTimeout(() => {
            brandsPopup.querySelector('.brands-popup-content').style.opacity = '1';
        }, 10);
    });

    
    brandsPopupClose.addEventListener('click', function () {
        brandsPopup.style.display = 'none';
    });

   
    brandsPopup.addEventListener('click', function (event) {
        if (event.target === brandsPopup) {
            brandsPopup.style.display = 'none';
        }
    });

 
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && brandsPopup.style.display === 'flex') {
            brandsPopup.style.display = 'none';
        }
    });






    // крутилка для смены картинок при наведении
    var brandCards = document.querySelectorAll('.brand-card');

    var FADE_MS = 400;   
    var HOLD_MS = 800;   

    brandCards.forEach(function (card) {
        var img = card.querySelector('img');
        if (!img) return;

     
        var images = [];
        var first = img.getAttribute('src');
        if (first) images.push(first);

        var list = img.getAttribute('data-images');
        if (list) {
            list.split(',').forEach(function (s) {
                s = s.trim();
                if (s) images.push(s);
            });
        }
        var legacyHover = img.getAttribute('data-hover-src');
        if (legacyHover && images.indexOf(legacyHover) === -1) {
            images.push(legacyHover);
        }
        for (var n = 2; n <= 8; n++) {
            var extra = img.getAttribute('data-img' + n);
            if (extra) images.push(extra);
        }

        if (images.length <= 1) return; 
    
        for (var i = 1; i < images.length; i++) {
            var pre = new Image();
            pre.src = images[i];
        }

        var idx = 0;
        var cycleId = null;     
        var fadeOutId = null;   
        var fadeInId = null;    

        function clearTimers() {
            if (cycleId) { clearInterval(cycleId); cycleId = null; }
            if (fadeOutId) { clearTimeout(fadeOutId); fadeOutId = null; }
            if (fadeInId) { clearTimeout(fadeInId); fadeInId = null; }
        }

        function show(i) {
          
            clearTimeout(fadeOutId);
            clearTimeout(fadeInId);

           
            img.style.opacity = '0';
            fadeOutId = setTimeout(function () {
                img.src = images[i];
                img.style.opacity = '1';
            }, FADE_MS);
        }

        function startCycle() {
            if (cycleId) return;           
            idx = 1 % images.length;       
            show(idx);

            cycleId = setInterval(function () {
                idx = (idx + 1) % images.length;
                show(idx);
            }, HOLD_MS + FADE_MS * 1.2);  
        }

        function stopCycle() {
            clearTimers();
            idx = 0;
            show(idx);                     
            //img.style.opacity = '1';
             //img.src = images[0];
        }

        card.addEventListener('mouseenter', startCycle);
        card.addEventListener('mouseleave', stopCycle);
        card.addEventListener('focusin', startCycle);
        card.addEventListener('focusout', stopCycle);

        
        var holdTimer = null;
        var previewActive = false;   
        var suppressClick = false;   

        card.addEventListener('touchstart', function () {
            
            holdTimer = setTimeout(function () {
                previewActive = true;
                startCycle();           
            }, 200);
        }, { passive: true });

        card.addEventListener('touchend', function (e) {
            clearTimeout(holdTimer);
            if (previewActive) {
                e.preventDefault();      
                stopCycle();             
                suppressClick = true;    
                previewActive = false;
            }
        }, { passive: false });

        card.addEventListener('touchcancel', function () {
            clearTimeout(holdTimer);
            if (previewActive) {
                stopCycle();
                previewActive = false;
            }
        }, { passive: true });

      
        card.addEventListener('click', function (e) {
            if (suppressClick) {
                e.preventDefault();
                suppressClick = false;
            }
        }, true); 


    });

    


});






