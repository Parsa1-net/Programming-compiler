#!/usr/bin/env node
/* ساخت صفحه‌های فرود سئو برای هر زبان (ثابت و قابل خزیدن بدون جاوااسکریپت) + به‌روزرسانی sitemap.xml
   اجرا:  node tools/build-seo.js   (بعد از هر تغییر در متن‌ها یا زبان‌ها دوباره اجرا کنید) */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),BASE='https://YOUR-USERNAME.github.io/YOUR-REPO/',TODAY='2026-11-15';
const src=fs.readFileSync(path.join(root,'script.js'),'utf8');
const LANGS=eval(src.slice(src.indexOf('const LANGS'),src.indexOf('const HTMLDEF'))+';LANGS');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const D={
 python:{fa:'پایتون',en:'Python',slug:'python',run:'پایتون ۳٫۱۵ (پیش‌انتشار) داخل مرورگر با Pyodide اجرا می‌شود و اگر بارگذاری نشد خودکار به ۳٫۱۴ و ۳٫۱۲ برمی‌گردد؛ بدون سرور و بدون نصب.',tips:['دستور input() مثل ترمینال واقعی تعاملی است؛ پرسش را می‌بینید و همان‌جا جواب می‌دهید.','کتابخانه‌هایی مثل numpy و pandas با import خودکار نصب می‌شوند.','کتابخانه‌ی گرافیکی customtkinter در مرورگر شبیه‌سازی شده و پنجره‌ی برنامه را نشان می‌دهد.']},
 c:{fa:'سی (C)',en:'C',slug:'c',run:'برنامه با جدیدترین GCC روی سرور کامپایل و اجرا می‌شود (در صورت قطعی، Compiler Explorer جایگزین می‌شود).',tips:['برنامه‌هایی که scanf یا getchar دارند قبل از اجرا از شما ورودی می‌گیرند.','خطاهای کامپایلر با شماره‌ی خط نمایش داده می‌شوند.','ورودی و خروجی فارسی و یونیکد درست نمایش داده می‌شود.']},
 cpp:{fa:'سی‌پلاس‌پلاس (C++)',en:'C++',slug:'cpp',run:'کد با جدیدترین GCC و گزینه‌ی -O2 (استاندارد C++17) روی سرور اجرا می‌شود.',tips:['کتابخانه‌ی استاندارد (STL) مثل vector، map و algorithm در دسترس است.','cin و getline قبل از اجرا ورودی می‌گیرند.','اگر سرور اصلی جواب ندهد، سرور دوم خودکار امتحان می‌شود.']},
 csharp:{fa:'سی‌شارپ (C#)',en:'C#',slug:'csharp',run:'کد با جدیدترین .NET روی Compiler Explorer اجرا می‌شود و در صورت قطعی، Judge0 جایگزین است.',tips:['برنامه‌های بدون کلاس و Main (top-level statements) خودکار به Program.Main تبدیل می‌شوند و شماره‌ی خطاها تغییر نمی‌کند.','Console.ReadLine قبل از اجرا ورودی می‌گیرد؛ Console.ReadKey در مرورگر پشتیبانی نمی‌شود.','LINQ، رکوردها، async/await و رشته‌های درون‌یابی‌شده با .NET جدید کار می‌کنند.']},
 java:{fa:'جاوا (Java)',en:'Java',slug:'java',run:'کد با جدیدترین JDK روی سرور کامپایل و اجرا می‌شود.',tips:['اگر کلاس عمومی شما Main نباشد، خودکار تغییر نام می‌دهد.','Scanner و BufferedReader قبل از اجرا ورودی می‌گیرند.','خطاهای کامپایل و استثناها با پیام کامل نمایش داده می‌شوند.']},
 php:{fa:'پی‌اچ‌پی (PHP)',en:'PHP',slug:'php',run:'اسکریپت PHP با نسخه‌ی خط فرمان روی سرور اجرا می‌شود.',tips:['ورودی را با fgets(STDIN) بخوانید.','کد باید با <?php شروع شود.','خروجی echo و print_r در ترمینال کدخانه نمایش داده می‌شود.']},
 javascript:{fa:'جاوااسکریپت',en:'JavaScript',slug:'javascript',run:'کد بدون DOM در Web Worker اجرا می‌شود (حلقه‌ی بی‌پایان صفحه را قفل نمی‌کند) و کد دارای DOM در پیش‌نمایش موبایل.',tips:['خروجی console.log در ترمینال دیده می‌شود.','کتابخانه‌هایی مثل Lodash، jQuery، Day.js، Math.js، Chart.js و Bootstrap را با یک کلیک اضافه کنید.','کد دارای await و import به‌صورت ماژول اجرا می‌شود.']},
 html:{fa:'اچ‌تی‌ام‌ال (HTML)',en:'HTML',slug:'html',run:'صفحه‌ی HTML شما همان‌جا در یک قاب موبایل (شبیه آیفون) نمایش داده می‌شود.',tips:['با هر تغییر، پیش‌نمایش زنده به‌روز می‌شود.','اسکریپت‌های داخل صفحه اجرا می‌شوند و خروجی console در ترمینال نمایش داده می‌شود.','می‌توانید کتابخانه‌هایی مثل Bootstrap را اضافه کنید.']},
 css:{fa:'سی‌اس‌اس (CSS)',en:'CSS',slug:'css',run:'استایل شما روی یک نمونه‌ی HTML کنار ویرایشگر اعمال و در قاب موبایل نمایش داده می‌شود.',tips:['HTML نمونه را هم می‌توانید ویرایش کنید.','پیش‌نمایش با هر تایپ به‌روز می‌شود.','پیشنهاد خودکار نام ویژگی‌ها (property) با کلید Tab کامل می‌شود.']},
 rust:{fa:'راست (Rust)',en:'Rust',slug:'rust',run:'کد با Rust Playground (نسخه‌ی stable) اجرا می‌شود و در صورت نیاز Compiler Explorer جایگزین است.',tips:['برنامه‌های بدون ورودی روی Rust Playground اجرا می‌شوند؛ برنامه‌های دارای stdin روی Compiler Explorer.','پیام‌های خطای کامپایلر Rust کامل نمایش داده می‌شود.','فقط کتابخانه‌ی استاندارد در دسترس است.']},
 go:{fa:'گو (Go)',en:'Go',slug:'go',run:'کد روی Compiler Explorer و در صورت قطعی روی Judge0 اجرا می‌شود.',tips:['برنامه باید package main و تابع main داشته باشد.','fmt.Scan و bufio قبل از اجرا ورودی می‌گیرند.','فقط کتابخانه‌ی استاندارد در دسترس است.']},
 julia:{fa:'جولیا (Julia)',en:'Julia',slug:'julia',run:'کد روی Compiler Explorer اجرا می‌شود.',tips:['println و حلقه‌ها و آرایه‌ها بدون مشکل اجرا می‌شوند.','اجرای اول ممکن است چند ثانیه طول بکشد.','بسته‌های خارجی نصب نمی‌شوند.']}
};
const CSS='body{margin:0;background:#0a0e27;color:#e6e9ff;font:16px/1.9 Vazirmatn,Tahoma,"Segoe UI",sans-serif}main{max-width:860px;margin:0 auto;padding:24px 18px 60px}a{color:#7dd3fc}h1{font-size:28px;line-height:1.5;margin:.4em 0}h2{font-size:20px;margin:1.6em 0 .4em;color:#c4b5fd}.cta{display:inline-block;background:#7c3aed;color:#fff;padding:12px 26px;border:2px solid #00e5ff;text-decoration:none;font-weight:700;margin:14px 0;box-shadow:4px 4px 0 #3b1d8f}pre{background:#070a1f;border:1px solid #2a2f6b;padding:14px;overflow:auto;direction:ltr;text-align:left;font:14px/1.6 Consolas,Menlo,monospace}nav.l{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:10px}.en{direction:ltr;text-align:left;border-top:1px solid #2a2f6b;margin-top:28px;padding-top:6px;color:#b6bde8}header a.b{font-weight:800;font-size:18px;text-decoration:none;color:#fff}';
const out=[];
for(const [id,d] of Object.entries(D)){
 const url=BASE+d.slug+'/',title=`کامپایلر ${d.fa} آنلاین | کامپایلر کدخانه (کد خانه)`,
  desc=`کامپایلر ${d.fa} آنلاین و رایگان کدخانه (کامپایلر کد خانه): کد ${d.en} را بنویسید و همین حالا در مرورگر اجرا کنید؛ بدون نصب، با تکمیل خودکار و هوش مصنوعی.`,
  kw=`کامپایلر ${d.fa} آنلاین, کامپایلر ${d.fa} کدخانه, کامپایلر کدخانه, کامپایلر کد خانه, اجرای ${d.en} آنلاین, online ${d.en} compiler, kodkhane ${d.en} compiler`,
  sample=LANGS[id]?LANGS[id].s:'',others=Object.values(D).filter(x=>x.slug!==d.slug).map(x=>`<a href="../${x.slug}/">کامپایلر ${esc(x.fa)} آنلاین</a>`).join('');
 const ld=[{"@context":"https://schema.org","@type":"WebPage","name":title,"description":desc,"url":url,"inLanguage":"fa","isPartOf":{"@type":"WebSite","name":"کدخانه","alternateName":["کامپایلر کدخانه","کامپایلر کد خانه","Kodkhane"],"url":BASE}},
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"کامپایلر کدخانه","item":BASE},{"@type":"ListItem","position":2,"name":`کامپایلر ${d.fa} آنلاین`,"item":url}]}];
 const html=`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(kw)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="referrer" content="no-referrer">
<link rel="canonical" href="${url}">
<link rel="icon" href="../icon.svg">
<meta property="og:type" content="website"><meta property="og:site_name" content="کدخانه"><meta property="og:locale" content="fa_IR">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}og-image.png"><meta name="twitter:card" content="summary_large_image">
${ld.map(x=>'<script type="application/ld+json">'+JSON.stringify(x)+'</script>').join('\n')}
<style>${CSS}</style>
</head>
<body>
<main>
<header><a class="b" href="../">کدخانه — کامپایلر کدخانه</a></header>
<h1>کامپایلر ${esc(d.fa)} آنلاین کدخانه</h1>
<p>کامپایلر ${esc(d.fa)} کدخانه (که با نام «کامپایلر کد خانه» هم جست‌وجو می‌شود) به شما اجازه می‌دهد برنامه‌ی ${esc(d.en)} را بدون نصب هیچ نرم‌افزاری بنویسید، اجرا کنید و خروجی را همان لحظه ببینید. ${esc(d.run)}</p>
<p><a class="cta" href="../index.html#${id}">اجرای کامپایلر ${esc(d.fa)} در کدخانه ◀</a></p>
<h2>چطور از کامپایلر ${esc(d.fa)} کدخانه استفاده کنم؟</h2>
<ol><li>کد ${esc(d.en)} خود را در ویرایشگر بنویسید یا فایل را باز کنید؛ پیشنهاد خودکار کلمات با کلید Tab کامل می‌شود.</li><li>دکمه‌ی «اجرا» یا کلیدهای Ctrl+Enter را بزنید.</li><li>خروجی و خطاها را در ترمینال زیر ویرایشگر ببینید و در صورت نیاز از دستیار هوشمند کمک بگیرید.</li></ol>
<h2>امکانات کامپایلر ${esc(d.fa)} کدخانه</h2>
<ul>${d.tips.map(t=>'<li>'+esc(t)+'</li>').join('')}<li>تاریخچه‌ی نسخه‌ها و بازگشت به کد قبلی، تم‌های روشن، تیره و متحرک، و ذخیره‌ی پروژه در حساب کاربری.</li></ul>
<h2>نمونه‌ی کد ${esc(d.en)}</h2>
<pre><code>${esc(sample)}</code></pre>
<h2>پرسش‌های متداول</h2>
<p><b>کامپایلر کدخانه رایگان است؟</b> بله، استفاده از کامپایلر ${esc(d.fa)} کدخانه رایگان است.</p>
<p><b>کامپایلر کد خانه نیاز به نصب دارد؟</b> خیر؛ همه‌چیز در مرورگر شما یا روی سرورهای اجرای کد انجام می‌شود. اگر بخواهید می‌توانید سایت را مثل یک برنامه نصب کنید (PWA).</p>
<p><b>${esc(d.fa)} در کدخانه روی چه نسخه‌ای اجرا می‌شود؟</b> ${esc(d.run)}</p>
<h2>سایر کامپایلرهای کدخانه</h2>
<nav class="l">${others}</nav>
<section class="en" lang="en" dir="ltr"><h2>Free online ${esc(d.en)} compiler — Kodkhane (Kod Khane)</h2>
<p>Kodkhane compiler (کامپایلر کدخانه / کامپایلر کد خانه) is a free online ${esc(d.en)} compiler and code editor. Write ${esc(d.en)} code, run it in your browser or on a remote sandbox, see the output instantly, and use the built-in AI assistant. No installation required.</p>
<p><a class="cta" href="../index.html#${id}">Open the ${esc(d.en)} compiler</a></p></section>
</main>
</body>
</html>
`;
 fs.mkdirSync(path.join(root,d.slug),{recursive:true});fs.writeFileSync(path.join(root,d.slug,'index.html'),html);out.push(d.slug);
}
const urls=[['',1.0,'weekly'],...out.map(s=>[s+'/',0.8,'monthly'])];
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u,p,f])=>`  <url>\n    <loc>${BASE}${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${f}</changefreq>\n    <priority>${p}</priority>\n  </url>`).join('\n')}\n</urlset>\n`);
console.log('pages:',out.join(', '));
