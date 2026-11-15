/* ضدِ clickjacking: اگر سایت داخل iframe بارگذاری شد، خودش را به صفحه‌ی اصلی می‌آورد (GitHub Pages اجازه‌ی هدر X-Frame-Options نمی‌دهد) */
(function(){try{if(window.top!==window.self){document.documentElement.style.display='none';window.top.location=window.self.location}}catch(e){document.documentElement.innerHTML=''}})();
