# کدخانه — کامپایلر آنلاین

## انتشار روی GitHub Pages
1. یک مخزن (repository) بسازید؛ پیشنهاد: نامی مثل `online-compiler`. همه‌ی فایل‌ها را در ریشه‌ی مخزن آپلود کنید.
2. Settings ← Pages ← Source: `Deploy from a branch` ← شاخه‌ی `main` و پوشه‌ی `/ (root)`.
3. آدرس سایت می‌شود `https://USERNAME.github.io/REPO/`.

## جایگزینی آدرس (لازم برای سئو)
در `index.html`، `sitemap.xml` و `robots.txt` دو عبارت `YOUR-USERNAME` و `YOUR-REPO` را عوض کنید:

    sed -i 's/YOUR-USERNAME/نام‌کاربری/g; s/YOUR-REPO/نام-مخزن/g' index.html sitemap.xml robots.txt

## معرفی سایت به گوگل
1. به Google Search Console بروید و Add property ← URL prefix را با آدرس سایت بزنید.
2. روش «HTML tag» را انتخاب کنید و تگ داده‌شده را جای خط کامنت‌شده‌ی `google-site-verification` در `index.html` بگذارید، سایت را دوباره منتشر و Verify کنید.
3. Sitemaps ← آدرس `sitemap.xml` را ثبت کنید. بعد در URL Inspection گزینه‌ی Request indexing را بزنید.
4. توضیح (About) و Topics مخزن گیت‌هاب را هم با کلمات `online-compiler`، `python`، `cpp`، `javascript` پر کنید و لینک سایت را در Website مخزن بگذارید.

نکته: `robots.txt` فقط وقتی خوانده می‌شود که سایت در ریشه‌ی دامنه باشد (دامنه‌ی اختصاصی یا مخزن `USERNAME.github.io`)؛ در حالت معمولی مخزن، ثبت sitemap در Search Console کافی است.
