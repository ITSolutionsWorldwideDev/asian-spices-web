import {
  ASIAN_SPICES_LOGO_BASE64,
  DEFAULT_LOGO_SRC,
  escapeHtml,
} from '../shared';

export interface AccountRegistrationEmailData {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  accountType?: string;
  loginUrl?: string;
  supportEmail?: string;
  phoneNumber?: string;
  logoUrl?: string;
  tiktokIconUrl?: string;
  instagramIconUrl?: string;
  facebookIconUrl?: string;
  youtubeIconUrl?: string;
}

/**
 * Generate Account Registration Confirmation HTML Email.
 * Layout and styling exactly match the deliverable order confirmation email.
 */
export function generateAccountRegistrationEmailHtml(data: AccountRegistrationEmailData = {}): string {
  let firstName = data.firstName?.trim();
  let lastName = data.lastName?.trim();
  if (!firstName && !lastName && data.fullName?.trim()) {
    const parts = data.fullName.trim().split(/\s+/);
    if (parts.length > 1) {
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    } else {
      firstName = parts[0];
    }
  }

  const email = (data.email && data.email.trim()) || '';
  const accountType = (data.accountType && data.accountType.trim()) || 'Klantaccount';
  const logoSrc = data.logoUrl || DEFAULT_LOGO_SRC || ASIAN_SPICES_LOGO_BASE64;

  const greetingTitle = firstName
    ? `Welkom, ${escapeHtml(firstName)}!`
    : 'Welkom bij Asian Spices!';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="nl">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Bevestiging Accountregistratie - Asian Spices</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <!--[if mso]>
  <style type="text/css">
    body, table, td, tr, p, div, span, a, strong, b, em {
      font-family: Arial, 'Segoe UI', Helvetica, sans-serif !important;
    }
    table {
      border-collapse: collapse !important;
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
  </style>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0; }
    td, tr { border: 0; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      min-width: 100%;
      background-color: #f1f2f5;
      font-family: 'Plus Jakarta Sans', Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
      color: #27272a;
    }

    .email-container {
      border: 0;
    }

    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        border-radius: 0px !important;
      }
      .mobile-padding {
        padding-left: 18px !important;
        padding-right: 18px !important;
      }
      .mobile-stack-col {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 12px !important;
      }
    }
  </style>
</head>
<body bgcolor="#f1f2f5" style="margin: 0; padding: 0; background-color: #f1f2f5; -webkit-font-smoothing: antialiased; word-break: break-word;">

  <!-- Full-width Canvas -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f1f2f5" style="background-color: #f1f2f5; width: 100%; margin: 0; padding: 24px 0 32px 0;">
    <tr>
      <td align="center" valign="top" style="padding: 0 10px;">
        <!--[if (gte mso 9)|(IE)]>
        <table role="presentation" width="620" align="center" cellpadding="0" cellspacing="0" border="0" style="width: 620px;">
          <tr>
            <td width="620" align="center" valign="top">
        <![endif]-->

        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" class="email-container">

          <!-- 1. Top Bar: Brand Logo & Label -->
          <tr>
            <td style="padding: 22px 34px 18px 34px; border: 0; border: none; mso-border-alt: none;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0; border: none; mso-border-alt: none;">
                <tr>
                  <td align="left" valign="middle" style="border: 0; border: none; mso-border-alt: none;">
                    <img src="${logoSrc}" alt="Asian Spices" width="70" height="70" style="display: block; border: 0; width: 70px; height: 70px; max-width: 70px; outline: none;" />
                  </td>
                  <td align="right" valign="middle" style="border: 0; border: none; mso-border-alt: none;">
                    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: #ea580c; text-transform: uppercase;">
                      ACCOUNTREGISTRATIE
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Hero Section (Matches Order Confirmation) -->
          <tr>
            <td bgcolor="#fffdfa" style="background-color: #fffdfa; padding: 34px 30px 36px 30px; text-align: center; border-top: 1px solid #fef3c7; border-bottom: 1px solid #fef3c7;" class="mobile-padding">

              <!-- Check Badge (Dark Green Circle) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 14px auto; border-collapse: separate;">
                <tr>
                  <td align="center" valign="middle" width="46" height="46" bgcolor="#1b4332" style="background-color: #1b4332; width: 46px; height: 46px; border-radius: 50%; text-align: center;">
                    <span style="color: #ffffff; font-size: 20px; font-weight: 800; line-height: 46px;">&#10003;</span>
                  </td>
                </tr>
              </table>

              <!-- Eyebrow -->
              <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #ea580c; text-transform: uppercase; margin-bottom: 8px;">
                REGISTRATIE SUCCESVOL
              </div>

              <!-- Main Greeting Title -->
              <h1 style="margin: 0 0 10px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; line-height: 36px; font-weight: 700; color: #18181b;">
                ${greetingTitle}
              </h1>

              <!-- Subtitle -->
              <p style="margin: 0 auto 10px auto; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; line-height: 20px; color: #52525b; max-width: 440px;">
                Hartelijk dank voor uw registratie bij Asian Spices. Uw account is succesvol aangemaakt en direct klaar voor gebruik.
              </p>
            </td>
          </tr>

          <!-- 3. Account Details Section -->
          <tr>
            <td style="padding: 28px 30px 20px 30px;" class="mobile-padding">

              <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 1.6px; color: #ea580c; text-transform: uppercase; margin-bottom: 6px;">
                UW GEGEVENS
              </div>
              <h2 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; line-height: 28px; font-weight: 700; color: #18181b;">
                Overzicht van uw account
              </h2>

              <!-- Account Info Table -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f8f9fa" style="background-color: #f8f9fa; border-radius: 12px; border: 1px solid #edf0f3; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #edf0f3; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; color: #71717a; text-transform: uppercase;">
                    E-mailadres
                  </td>
                  <td align="right" style="padding: 14px 18px; border-bottom: 1px solid #edf0f3; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; font-weight: 700; color: #18181b;">
                    ${escapeHtml(email)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; color: #71717a; text-transform: uppercase;">
                    Accounttype
                  </td>
                  <td align="right" style="padding: 14px 18px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; font-weight: 700; color: #ea580c;">
                    ${escapeHtml(accountType)}
                  </td>
                </tr>
              </table>

              <!-- Benefits Card (Matches How Nu Verder style) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #edf0f3; padding: 20px; margin-bottom: 8px;">
                <tr>
                  <td>
                    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; font-weight: 800; color: #18181b; margin-bottom: 14px;">
                      Met uw account heeft u direct toegang tot:
                    </div>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 10px;">
                      <tr>
                        <td valign="top" width="22" style="font-family: Arial, sans-serif; font-size: 13px; color: #ea580c; font-weight: bold; line-height: 20px;">
                          &#10003;
                        </td>
                        <td style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12.5px; line-height: 20px; color: #52525b;">
                          <strong style="color: #18181b;">Bestellingen &amp; Facturen:</strong> Overzicht van al uw actuele en eerdere bestellingen 24/7 inzien.
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 10px;">
                      <tr>
                        <td valign="top" width="22" style="font-family: Arial, sans-serif; font-size: 13px; color: #ea580c; font-weight: bold; line-height: 20px;">
                          &#10003;
                        </td>
                        <td style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12.5px; line-height: 20px; color: #52525b;">
                          <strong style="color: #18181b;">Snelle Verwerking:</strong> Gegevens vooraf ingevuld voor een soepele en veilige checkout.
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" width="22" style="font-family: Arial, sans-serif; font-size: 13px; color: #ea580c; font-weight: bold; line-height: 20px;">
                          &#10003;
                        </td>
                        <td style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12.5px; line-height: 20px; color: #52525b;">
                          <strong style="color: #18181b;">Spaarpunten:</strong> Automatisch punten sparen bij elke bestelling voor exclusieve kortingen.
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 4. Community: Asian Spices Kitchen (Matches Order Confirmation) -->
          <tr>
            <td style="padding: 0 30px 24px 30px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f1f5f3" style="background-color: #f1f5f3; border-radius: 16px; border: 1px solid #e0eae4; padding: 24px;">
                <tr>
                  <td>
                    <!-- Eyebrow -->
                    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.6px; color: #ea580c; text-transform: uppercase; margin-bottom: 6px;">
                      ASIAN SPICES KITCHEN
                    </div>

                    <!-- Title -->
                    <h2 style="margin: 0 0 10px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; line-height: 28px; font-weight: 700; color: #18181b;">
                      Deel uw kookcreaties &amp; spaar voor cadeaus!
                    </h2>

                    <!-- Subtitle -->
                    <p style="margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12.5px; line-height: 19px; color: #52525b;">
                      Bent u trots op uw culinaire creaties? Deel uw talent met onze community en inspireer andere liefhebbers van de Aziatische keuken!
                    </p>

                    <!-- Two white cards -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Card A -->
                        <td width="48%" valign="top" bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 10px; border: 1px solid #e4e4e7; padding: 14px 16px;" class="mobile-stack-col">
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; font-weight: 800; color: #18181b; margin-bottom: 4px;">
                            Upload via de website
                          </div>
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11.5px; line-height: 17px; color: #52525b;">
                            Voeg foto&apos;s of video&apos;s van uw gerecht toe via Kookkunsten Delen en spaar voor gratis producten en cadeaus.
                          </div>
                        </td>

                        <td width="4%"></td>

                        <!-- Card B -->
                        <td width="48%" valign="top" bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 10px; border: 1px solid #e4e4e7; padding: 14px 16px;" class="mobile-stack-col">
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; font-weight: 800; color: #18181b; margin-bottom: 4px;">
                            Deel via social media
                          </div>
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11.5px; line-height: 17px; color: #52525b;">
                            Gebruik <strong style="color: #ea580c;">#AsianSpicesKitchen</strong> op Instagram of TikTok en tag ons account.
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 5. Support Banner (Matches Order Confirmation) -->
          <tr>
            <td style="padding: 0 30px 30px 30px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fff9f0" style="background-color: #fff9f0; border-left: 4px solid #ea580c; border-radius: 0 12px 12px 0; border-top: 1px solid #fef3c7; border-right: 1px solid #fef3c7; border-bottom: 1px solid #fef3c7; padding: 22px;">
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left Details -->
                        <td valign="top" class="mobile-stack-col">
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.4px; color: #c2410c; text-transform: uppercase; margin-bottom: 4px;">
                            HULP NODIG?
                          </div>
                          <h3 style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; color: #18181b;">
                            Onze klantenservice helpt u graag.
                          </h3>
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; color: #c2410c; text-transform: uppercase;">
                            ONZE E-MAILSERVICE IS 24/7 BESCHIKBAAR.
                          </div>
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; color: #71717a; margin-top: 2px;">
                            Reactietijd binnen 24 uur.
                          </div>
                        </td>

                        <!-- Right Hours Info -->
                        <td valign="top" align="right" class="mobile-stack-col" style="text-align: right;">
                          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; color: #71717a;">
                            Ma t/m vr &middot; 07:00&ndash;15:00
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. Footer (Matches Order Confirmation) -->
          <tr>
            <td style="padding: 0 26px 30px 26px; border: 0; border: none; mso-border-alt: none;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0; border: none; mso-border-alt: none; text-align: center;">
                <tr>
                  <td style="background-color: #f8f9fa; border-radius: 16px; border: 1px solid #edf0f3; mso-border-alt: solid #edf0f3 1pt; padding: 28px 24px 26px 24px; text-align: center;">
                    <!-- Brand Logo -->
                    <div style="text-align: center; margin-bottom: 10px; border: 0;">
                      <img src="${logoSrc}" alt="Asian Spices" width="68" height="68" style="display: block; border: 0; margin: 0 auto; width: 68px; height: 68px; max-width: 68px; outline: none;" />
                    </div>

                    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11.5px; color: #71717a; margin-top: 10px; margin-bottom: 16px; border: 0;">
                      Volg ons voor dagelijkse inspiratie
                    </div>

                    <!-- Divider -->
                    <div style="border-top: 1px solid #e5e7eb; width: 85%; margin: 0 auto 18px auto;"></div>

                    <!-- Sign-off -->
                    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; line-height: 20px; color: #52525b;">
                      Met vriendelijke groet,<br />
                      <strong style="color: #18181b; font-weight: 800;">Het team van Asian Spices</strong>
                    </div>

                    <!-- Disclaimer -->
                    <p style="margin: 14px auto 0 auto; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10.5px; line-height: 17px; color: #a1a1aa; max-width: 480px;">
                      U ontvangt deze e-mail omdat u recent een account heeft aangemaakt bij Asian Spices. &copy; 2026 Asian Spices. Alle rechten voorbehouden.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!--[if (gte mso 9)|(IE)]>
            </td>
          </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Plain-text fallback for email clients that do not render HTML.
 */
export function generateAccountRegistrationEmailText(data: AccountRegistrationEmailData = {}): string {
  let firstName = data.firstName?.trim();
  let lastName = data.lastName?.trim();
  if (!firstName && !lastName && data.fullName?.trim()) {
    const parts = data.fullName.trim().split(/\s+/);
    if (parts.length > 1) {
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    } else {
      firstName = parts[0];
    }
  }

  const email = (data.email && data.email.trim()) || '';
  const accountType = (data.accountType && data.accountType.trim()) || 'Klantaccount';

  const greetingLine = firstName
    ? `Welkom bij Asian Spices, ${firstName}!`
    : 'Welkom bij Asian Spices!';

  return `ASIAN SPICES - BEVESTIGING ACCOUNTREGISTRATIE
==================================================

${greetingLine}

Hartelijk dank voor uw registratie bij Asian Spices. Hierbij bevestigen wij dat uw account succesvol is aangemaakt.

UW ACCOUNTGEGEVENS:
--------------------------------------------------
E-mailadres: ${email}
Accounttype: ${accountType}

Met uw account heeft u direct toegang tot:
- Overzicht van uw actuele en eerdere bestellingen
- Inzicht en beheer van uw contact- en factuurgegevens
- Snelle en veilige verwerking van bestellingen
- Automatisch sparen van punten bij elke aankoop

--------------------------------------------------
ASIAN SPICES KITCHEN
Deel uw kookcreaties met hashtag #AsianSpicesKitchen op Instagram of TikTok en spaar voor cadeaus!

--------------------------------------------------
HULP NODIG?
Onze klantenservice helpt u graag.
Openingstijden: Ma t/m vr · 07:00–15:00
Reactietijd via e-mail binnen 24 uur.

--------------------------------------------------
Met vriendelijke groet,
Het team van Asian Spices
© 2026 Asian Spices. Alle rechten voorbehouden.
`;
}