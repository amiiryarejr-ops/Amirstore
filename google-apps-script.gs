/**
 * AmiirStore — Order Backend (Google Apps Script)
 * ---------------------------------------------------
 * Kani wuxuu u shaqeeyaa sida "database" iyo email notifier.
 * Marka macaamil buuxiyo form-ka website-ka, xogta wuxuu si toos
 * ah ugu kaydin doonaa Google Sheet-kan, kuna soo diri doonaa
 * email adiga kuu sheegaya order-ka cusub.
 *
 * SIDA LOO RAKIBO (5 tallaabo, 5 daqiiqo):
 *
 * 1. Tag https://sheets.google.com oo samee spreadsheet cusub,
 *    u bixi magaca "AmiirStore Orders"
 *
 * 2. Gudaha spreadsheet-ka: Extensions → Apps Script
 *
 * 3. Tirtir koodhkii hore ee ku jiray, ku dheji koodhkan oo dhan
 *    halkiisa, kadibna beddel EMAIL_TO hoose email-kaaga dhabta ah
 *
 * 4. Kor-midig: Deploy → New deployment → gear icon → "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Kadib Deploy → ogolow permissions-ka (Authorize access)
 *
 * 5. Nuqul (copy) URL-ka "Web app" ee laguu siiyay, ku dheji
 *    faylka assets/js/checkout-config.js ee halka "PASTE_YOUR_URL_HERE" ku qoran tahay
 */

// ================= BEDDEL TAN EMAIL-KAAGA =================
const EMAIL_TO = "your-email@gmail.com"; // <-- KU BEDDEL EMAIL-KAAGA DHABTA AH

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Haddii safka 1-aad (headers) uusan jirin, samee
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Taariikhda", "Magaca", "Telefoonka", "Magaalada/Degmada",
        "Cinwaanka Faahfaahsan", "Alaabta La Dalbaday", "Wadarta Qiimaha (KES)", "Fariin Dheeraad ah"
      ]);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.location || "",
      data.address || "",
      data.items || "",
      data.total || "",
      data.message || ""
    ]);

    // Dir email digniin ah
    const subject = "🛒 Dalab Cusub — AmiirStore (" + (data.name || "Macaamil") + ")";
    const body =
      "Waxaad heshay dalab cusub oo AmiirStore ah!\n\n" +
      "Magaca: " + (data.name || "-") + "\n" +
      "Telefoonka: " + (data.phone || "-") + "\n" +
      "Magaalada/Degmada: " + (data.location || "-") + "\n" +
      "Cinwaanka Faahfaahsan: " + (data.address || "-") + "\n" +
      "Alaabta La Dalbaday: " + (data.items || "-") + "\n" +
      "Wadarta Qiimaha: KES " + (data.total || "-") + "\n" +
      "Fariinta: " + (data.message || "-") + "\n\n" +
      "Fadlan la soo xiriir macaamilka si aad u xaqiijiso oo u dhiibto alaabta.";

    MailApp.sendEmail(EMAIL_TO, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
