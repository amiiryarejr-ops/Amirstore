# AmiirStore — Tilmaamaha Rakibaadda

## 1. Daalac Website-ka (Bilaash)
Isticmaal Netlify ama GitHub Pages si aad u daalacdo folder-kan oo dhan (`index.html` + `assets/`).

## 2. Xir Backend-ka (Google Sheets — kaydinta xogta macaamiisha)

Faylka `google-apps-script.gs` wuxuu ku jira dhammaan tilmaamaha, laakiin si kooban:

1. Tag sheets.google.com → samee spreadsheet cusub, u bixi "AmiirStore Orders"
2. Extensions → Apps Script → tirtir koodhkii hore → ku dheji koodhka `google-apps-script.gs`
3. Beddel `EMAIL_TO` ee koodhka gudihiisa — geli email-kaaga dhabta ah
4. Deploy → New deployment → Web app → Execute as: **Me** → Who has access: **Anyone** → Deploy
5. Nuqul URL-ka laguu siiyay (wuxuu u eg yahay `https://script.google.com/macros/s/.../exec`)
6. Fur `assets/js/checkout-config.js` → ku beddel `PASTE_YOUR_URL_HERE` URL-kaas aad nuqushay

## 3. Sida ay u shaqeyso

- Macaamilku wuxuu dooranayaa alaab (+ button) → gujiyaa icon-ka gaariga (🛒) kor
- Wuxuu buuxinayaa: Magaca, Telefoonka, Magaalada, Cinwaanka, Fariin
- Marka uu gujiyo "Dir Dalabka":
  - Xogtiisu waxay si toos ah ugu dhici doontaa Google Sheet-kaaga
  - Email ayaa kuu iman doonta (adiga) oo leh dhammaan faahfaahinta dalabka
- Adiga ayaa markaas la soo xiriiri kara macaamilka (wac ama WhatsApp) si aad u dhiibto alaabta

## 4. Muhiim ah
- Ha ilaawin in aad "EMAIL_TO" ku beddesho email-kaaga dhabta ah faylka `.gs`
- Ha ilaawin in aad URL-ka Apps Script ku dhejiso `checkout-config.js`
- Google Apps Script waa 100% bilaash — xad ma laha dalabyo (submissions)
