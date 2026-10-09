import {
  ASIAN_SPICES_LOGO_BASE64,
  TIKTOK_ICON_BASE64,
  INSTAGRAM_ICON_BASE64,
  FACEBOOK_ICON_BASE64,
  YOUTUBE_ICON_BASE64,
  DEFAULT_LOGO_SRC,
  DEFAULT_TIKTOK_SRC,
  DEFAULT_INSTAGRAM_SRC,
  DEFAULT_FACEBOOK_SRC,
  DEFAULT_YOUTUBE_SRC,
  renderEmailSocialFooter,
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
 * Compatible with Microsoft Outlook (Word engine), Gmail, Apple Mail, and mobile clients.
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

  let salutation = 'Beste klant,';
  if (firstName && lastName) {
    salutation = `Beste <span style="color: #ea580c;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</span>,`;
  } else if (firstName) {
    salutation = `Beste <span style="color: #ea580c;">${escapeHtml(firstName)}</span>,`;
  } else if (lastName) {
    salutation = `Geachte heer/mevrouw <span style="color: #ea580c;">${escapeHtml(lastName)}</span>,`;
  }

  const email = (data.email && data.email.trim()) || '';
  const accountType = (data.accountType && data.accountType.trim()) || 'Klantaccount';
  const loginUrl = data.loginUrl || 'https://www.asianspices.online/login';
  const supportEmail = data.supportEmail || 'support@asianspices.online';
  const phoneNumber = data.phoneNumber || '06 44844844';
  const phoneClean = phoneNumber.replace(/[^0-9+]/g, '');

  const logoSrc = data.logoUrl || DEFAULT_LOGO_SRC || ASIAN_SPICES_LOGO_BASE64;
  const tiktokIconSrc = data.tiktokIconUrl || DEFAULT_TIKTOK_SRC || TIKTOK_ICON_BASE64;
  const instagramIconSrc = data.instagramIconUrl || DEFAULT_INSTAGRAM_SRC || INSTAGRAM_ICON_BASE64;
  const facebookIconSrc = data.facebookIconUrl || DEFAULT_FACEBOOK_SRC || FACEBOOK_ICON_BASE64;
  const youtubeIconSrc = data.youtubeIconUrl || DEFAULT_YOUTUBE_SRC || YOUTUBE_ICON_BASE64;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="nl">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Bevestiging Accountregistratie - Asian Spices</title>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
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
  <!--[if !mso]><!-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
  </style>
  <!--<![endif]-->
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
      .mobile-contact-col {
        display: block !important;
        width: 100% !important;
        margin-bottom: 8px !important;
      }
      .mobile-social-col {
        display: inline-block !important;
        width: 46% !important;
        max-width: 160px !important;
        margin: 4px 1.5% !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
    }
  </style>
</head>
<body bgcolor="#f1f2f5" style="margin: 0; padding: 0; background-color: #f1f2f5; -webkit-font-smoothing: antialiased; word-break: break-word;">
  <!-- Preheader text (hidden preview) -->
  <div style="display: none; font-size: 1px; color: #f1f2f5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Hartelijk dank voor uw registratie bij Asian Spices. Uw account is succesvol aangemaakt.
  </div>

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
          
          <!-- 1. Header: Brand Logo & Right Label -->
          <tr>
            <td style="padding: 18px 34px 16px 34px; border: 0; border: none; mso-border-alt: none;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0; border: none; mso-border-alt: none;">
                <tr>
                  <td align="left" valign="middle" style="border: 0; border: none; mso-border-alt: none;">
                    <img src="${logoSrc}" alt="Asian Spices" width="70" height="70" style="display: block; border: 0; width: 70px; height: 70px; max-width: 70px; outline: none;" />
                  </td>
                  <td align="right" valign="middle" style="border: 0; border: none; mso-border-alt: none;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" bgcolor="#fff7ed" style="background-color: #fff7ed; border-radius: 14px; border: 1px solid #ffedd5;">
                      <tr>
                        <td style="padding: 6px 14px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; color: #ea580c; text-transform: uppercase;">
                          ACCOUNTREGISTRATIE
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Hero Banner: Vibrant Gradient with Centered Welcome Title -->
          <tr>
            <td bgcolor="#ea580c" style="padding: 0; border: 0; background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%); background-color: #ea580c;">
              <!--[if gte mso 9]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 620px; height: 160px;">
              <v:fill type="tile" color="#ea580c" />
              <v:textbox inset="0,0,0,0">
              <![endif]-->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tr>
                  <td align="center" style="padding: 34px 24px 36px 24px; text-align: center;" class="mobile-padding">
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 2.2px; color: #ffedd5; text-transform: uppercase; margin-bottom: 6px;">
                      WELKOM BIJ
                    </div>
                    <h1 style="margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 26px; line-height: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">
                      Bevestiging Accountregistratie
                    </h1>
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 18px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">
                      Onderwerp: Bevestiging registratie account &ndash; Asian Spices
                    </div>
                  </td>
                </tr>
              </table>
              <!--[if gte mso 9]>
              </v:textbox>
              </v:rect>
              <![endif]-->
            </td>
          </tr>

          <!-- 3. Main Content: Account Confirmation Card -->
          <tr>
            <td style="padding: 28px 30px 20px 30px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #edf0f3; mso-border-alt: solid #edf0f3 1pt; padding: 24px 22px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <tr>
                  <td style="padding: 6px 4px;">
                    <!-- Salutation -->
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 15px; font-weight: 800; color: #18181b; margin-bottom: 10px;">
                      ${salutation}
                    </div>

                    <!-- Intro copy -->
                    <p style="margin: 0 0 18px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 21px; color: #52525b;">
                      Hartelijk dank voor uw registratie bij Asian Spices. Hierbij bevestigen wij dat uw account succesvol is aangemaakt.
                    </p>

                    <!-- Divider -->
                    <div style="border-top: 1px solid #f1f2f5; margin: 18px 0;"></div>

                    <!-- Features section -->
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13.5px; font-weight: 800; color: #18181b; margin-bottom: 12px;">
                      Met uw account heeft u direct toegang tot de volgende mogelijkheden:
                    </div>

                    <!-- Feature items -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px; border-collapse: collapse;">
                      <tr>
                        <td valign="top" width="18" style="padding: 5px 0; color: #ea580c; font-size: 11px; line-height: 20px;">
                          &#9670;
                        </td>
                        <td valign="top" style="padding: 5px 0 5px 8px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 20px; color: #3f3f46;">
                          Overzicht van uw actuele en eerdere bestellingen
                        </td>
                      </tr>
                      <tr>
                        <td valign="top" width="18" style="padding: 5px 0; color: #ea580c; font-size: 11px; line-height: 20px;">
                          &#9670;
                        </td>
                        <td valign="top" style="padding: 5px 0 5px 8px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 20px; color: #3f3f46;">
                          Inzicht en beheer van uw contact- en factuurgegevens
                        </td>
                      </tr>
                      <tr>
                        <td valign="top" width="18" style="padding: 5px 0; color: #ea580c; font-size: 11px; line-height: 20px;">
                          &#9670;
                        </td>
                        <td valign="top" style="padding: 5px 0 5px 8px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 20px; color: #3f3f46;">
                          Snelle en effici&euml;nte verwerking van toekomstige bestellingen
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="border-top: 1px solid #f1f2f5; margin: 18px 0;"></div>

                    <!-- Account Details Subheading -->
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13.5px; font-weight: 800; color: #18181b; margin-bottom: 12px;">
                      Uw accountgegevens:
                    </div>

                    <!-- Gray Account Info Table -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f8f9fa" style="background-color: #f8f9fa; border-radius: 10px; border: 1px solid #edf0f3; mso-border-alt: solid #edf0f3 1pt; margin-bottom: 16px;">
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #edf0f3; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.8px; color: #71717a; text-transform: uppercase;">
                          E-MAILADRES
                        </td>
                        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #edf0f3; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 700; color: #ea580c;">
                          ${escapeHtml(email)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.8px; color: #71717a; text-transform: uppercase;">
                          ACCOUNTTYPE
                        </td>
                        <td align="right" style="padding: 12px 16px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 700; color: #18181b;">
                          ${escapeHtml(accountType)}
                        </td>
                      </tr>
                    </table>

                    <!-- Subtext -->
                    <p style="margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 19px; color: #71717a; text-align: center;">
                      U kunt te allen tijde inloggen via onze website om uw instellingen en bestelstatus te beheren.
                    </p>

                    <!-- Big Orange CTA Button (Bulletproof table button for Outlook & Web) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tr>
                        <td align="center" valign="middle" bgcolor="#ea580c" style="background-color: #ea580c; border-radius: 26px; padding: 13px 34px; mso-padding-alt: 13px 34px; box-shadow: 0 3px 10px rgba(234, 88, 12, 0.3);">
                          <a href="${loginUrl}" target="_blank" style="display: block; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13.5px; font-weight: 800; color: #ffffff; text-decoration: none; line-height: 100%; white-space: nowrap;">
                            Inloggen op mijn account
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4. Community Card: Deel uw kookkunsten -->
          <tr>
            <td style="padding: 6px 30px 20px 30px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fffbf5" style="background-color: #fffbf5; border-radius: 16px; border: 1px solid #fed7aa; mso-border-alt: solid #fed7aa 1pt; padding: 24px 22px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tr>
                  <td style="padding: 4px;">
                    <!-- Community Tag -->
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: #ea580c; text-transform: uppercase; margin-bottom: 8px;">
                      &mdash; COMMUNITY
                    </div>

                    <!-- Title -->
                    <h2 style="margin: 0 0 10px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 16px; line-height: 23px; font-weight: 800; color: #18181b;">
                      Deel uw kookkunsten via onze website en spaar voor leuke cadeaus!
                    </h2>

                    <!-- Subtitle -->
                    <p style="margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12.5px; line-height: 20px; color: #52525b;">
                      Bent u trots op uw culinaire creaties? Sluit aan bij onze kookcommunity en inspireer andere liefhebbers van de Aziatische keuken!
                    </p>

                    <!-- Steps Heading -->
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 800; color: #18181b; margin-bottom: 14px;">
                      Zo werkt het:
                    </div>

                    <!-- Step 1 -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px; border-collapse: collapse;">
                      <tr>
                        <td valign="top" width="28" style="padding-top: 1px;">
                          <!-- Number Badge 1 -->
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="22" height="22" bgcolor="#ea580c" style="background-color: #ea580c; border-radius: 50%; border-collapse: separate;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; line-height: 22px; text-align: center;">
                                1
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top" style="padding-left: 10px;">
                          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 800; color: #18181b; margin-bottom: 3px;">
                            Upload uw recept direct via onze website:
                          </div>
                          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 18px; color: #52525b;">
                            Log in op uw account en ga naar de pagina [Kookkunsten Delen / Recept Uploaden]. Voeg uw foto&apos;s, kookvideo of favoriete recept toe.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Step 2 -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px; border-collapse: collapse;">
                      <tr>
                        <td valign="top" width="28" style="padding-top: 1px;">
                          <!-- Number Badge 2 -->
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="22" height="22" bgcolor="#ea580c" style="background-color: #ea580c; border-radius: 50%; border-collapse: separate;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; line-height: 22px; text-align: center;">
                                2
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top" style="padding-left: 10px;">
                          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 800; color: #18181b; margin-bottom: 3px;">
                            Deel via sociale media
                          </div>
                          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 18px; color: #52525b;">
                            Post uw creatie op social media met de hashtag <strong style="color: #ea580c;">#AsianSpicesKitchen</strong> en tag ons account.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Step 3 -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td valign="top" width="28" style="padding-top: 1px;">
                          <!-- Number Badge 3 -->
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="22" height="22" bgcolor="#ea580c" style="background-color: #ea580c; border-radius: 50%; border-collapse: separate;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; line-height: 22px; text-align: center;">
                                3
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top" style="padding-left: 10px;">
                          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 800; color: #18181b; margin-bottom: 3px;">
                            Spaar punten en win cadeaus
                          </div>
                          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 18px; color: #52525b;">
                            Voor elke goedgekeurde inzending ontvangt u spaarpunten in uw account. Wissel uw punten eenvoudig in voor exclusieve kortingen, gratis specerijenpakketten of unieke keukengadgets.
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 5. Support / Questions Card: Heeft u vragen? -->
          <tr>
            <td style="padding: 6px 30px 24px 30px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #edf0f3; mso-border-alt: solid #edf0f3 1pt; padding: 22px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14.5px; font-weight: 800; color: #18181b; margin-bottom: 8px;">
                      Heeft u vragen?
                    </div>

                    <!-- Description -->
                    <p style="margin: 0 0 16px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12.5px; line-height: 20px; color: #52525b;">
                      Heeft u vragen over ons assortiment of wenst u ondersteuning bij uw bestelling? Neem gerust contact op met onze klantenservice via <a href="mailto:${supportEmail}" style="color: #ea580c; text-decoration: underline;">${supportEmail}</a> of telefonisch via <a href="tel:${phoneClean}" style="color: #ea580c; text-decoration: underline;">${phoneNumber}</a>.
                    </p>

                    <!-- Contact Pill Badges (side-by-side or stacked on mobile) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Email Pill -->
                        <td valign="middle" style="padding-right: 6px; padding-bottom: 6px;" class="mobile-contact-col">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" bgcolor="#f4f4f5" style="background-color: #f4f4f5; border-radius: 20px; border: 1px solid #e4e4e7; mso-border-alt: solid #e4e4e7 1pt;">
                            <tr>
                              <td style="padding: 8px 16px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12px; font-weight: 700; color: #27272a;">
                                <a href="mailto:${supportEmail}" style="color: #27272a; text-decoration: none;">
                                  &#9993; ${supportEmail}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>

                        <!-- Phone Pill -->
                        <td valign="middle" style="padding-left: 6px; padding-bottom: 6px;" class="mobile-contact-col">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" bgcolor="#f4f4f5" style="background-color: #f4f4f5; border-radius: 20px; border: 1px solid #e4e4e7; mso-border-alt: solid #e4e4e7 1pt;">
                            <tr>
                              <td style="padding: 8px 16px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12px; font-weight: 700; color: #27272a;">
                                <a href="tel:${phoneClean}" style="color: #27272a; text-decoration: none;">
                                  &#9742; ${phoneNumber}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. Shared Social Footer: Outlook & Gmail Bulletproof -->
          ${renderEmailSocialFooter({
            logoUrl: logoSrc,
            tiktokIconUrl: tiktokIconSrc,
            instagramIconUrl: instagramIconSrc,
            facebookIconUrl: facebookIconSrc,
            youtubeIconUrl: youtubeIconSrc,
            signoffText: 'Met vriendelijke groet,<br /><strong style="color: #18181b; font-weight: 800;">Het team van Asian Spices</strong>',
            subtext: 'U ontvangt deze e-mail omdat u recent een account heeft aangemaakt bij Asian Spices. &copy; 2026 Asian Spices. Alle rechten voorbehouden.',
          })}

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

  let salutation = 'Beste klant,';
  if (firstName && lastName) {
    salutation = `Beste ${firstName} ${lastName},`;
  } else if (firstName) {
    salutation = `Beste ${firstName},`;
  } else if (lastName) {
    salutation = `Geachte heer/mevrouw ${lastName},`;
  }

  const email = (data.email && data.email.trim()) || '';
  const accountType = (data.accountType && data.accountType.trim()) || 'Klantaccount';
  const loginUrl = data.loginUrl || 'https://www.asianspices.online/login';
  const supportEmail = data.supportEmail || 'support@asianspices.online';
  const phoneNumber = data.phoneNumber || '06 44844844';

  return `ASIAN SPICES - BEVESTIGING ACCOUNTREGISTRATIE
==================================================

${salutation}

Hartelijk dank voor uw registratie bij Asian Spices. Hierbij bevestigen wij dat uw account succesvol is aangemaakt.

Met uw account heeft u direct toegang tot de volgende mogelijkheden:
- Overzicht van uw actuele en eerdere bestellingen
- Inzicht en beheer van uw contact- en factuurgegevens
- Snelle en efficiënte verwerking van toekomstige bestellingen

UW ACCOUNTGEGEVENS:
--------------------------------------------------
E-mailadres: ${email}
Accounttype: ${accountType}

U kunt te allen tijde inloggen via onze website om uw instellingen en bestelstatus te beheren:
${loginUrl}

--------------------------------------------------
COMMUNITY: DEEL UW KOOKKUNSTEN & WIN LEUKE CADEAUS!
Bent u trots op uw culinaire creaties? Sluit aan bij onze kookcommunity en inspireer andere liefhebbers van de Aziatische keuken!

Zo werkt het:
1. Upload uw recept direct via onze website:
   Log in op uw account en ga naar [Kookkunsten Delen / Recept Uploaden].
2. Deel via sociale media:
   Post uw creatie met hashtag #AsianSpicesKitchen en tag ons account.
3. Spaar punten en win cadeaus:
   Voor elke goedgekeurde inzending ontvangt u spaarpunten voor exclusieve kortingen en specerijenpakketten.

--------------------------------------------------
HEEFT U VRAGEN?
Neem gerust contact op met onze klantenservice:
E-mail: ${supportEmail}
Telefoon: ${phoneNumber}

--------------------------------------------------
Met vriendelijke groet,
Het team van Asian Spices

Volg ons op TikTok, Instagram, Facebook en YouTube.
© 2026 Asian Spices. Alle rechten voorbehouden.
`;
}
