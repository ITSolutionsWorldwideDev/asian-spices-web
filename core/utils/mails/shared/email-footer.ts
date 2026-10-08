import { ASIAN_SPICES_LOGO_BASE64 } from '@/core/partner-logo-data';
import {
  TIKTOK_ICON_BASE64,
  INSTAGRAM_ICON_BASE64,
  FACEBOOK_ICON_BASE64,
  YOUTUBE_ICON_BASE64,
} from '@/core/partner-icons-data';

export interface EmailFooterOptions {
  logoUrl?: string;
  tiktokIconUrl?: string;
  instagramIconUrl?: string;
  facebookIconUrl?: string;
  youtubeIconUrl?: string;
  signoffText?: string;
  subtext?: string;
}

/**
 * Outlook (Word engine) & Gmail bulletproof social footer.
 * Note: Never wrap <table> with <a> tag because Outlook ignores/strips links on tables.
 * Anchor tags must reside inside <td>.
 */
export function renderEmailSocialFooter(options: EmailFooterOptions = {}): string {
  const logoSrc = options.logoUrl || ASIAN_SPICES_LOGO_BASE64;
  const tiktokIconSrc = options.tiktokIconUrl || TIKTOK_ICON_BASE64;
  const instagramIconSrc = options.instagramIconUrl || INSTAGRAM_ICON_BASE64;
  const facebookIconSrc = options.facebookIconUrl || FACEBOOK_ICON_BASE64;
  const youtubeIconSrc = options.youtubeIconUrl || YOUTUBE_ICON_BASE64;
  const signoff = options.signoffText || 'Hartelijke groet,<br /><strong style="color: #18181b; font-weight: 800;">Het Asian Spices Team</strong>';
  const subtext = options.subtext ?? 'We kijken uit naar een inspirerende, smaakvolle en langdurige samenwerking. Welkom bij de Asian Spices-familie!';

  return `
      <!-- Shared Footer: Rounded container inside email with Brand Logo & Social Icons -->
      <tr>
        <td style="padding: 0 26px 30px 26px; border: 0; border: none; mso-border-alt: none;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0; border: none; mso-border-alt: none; text-align: center;">
            <tr>
              <td style="background-color: #f8f9fa; border-radius: 16px; border: 1px solid #edf0f3; mso-border-alt: solid #edf0f3 1pt; padding: 28px 24px 26px 24px; text-align: center;">
                <!-- Centered Brand Logo -->
                <div style="text-align: center; margin-bottom: 10px; border: 0;">
                  <img src="${logoSrc}" alt="Asian Spices" width="96" height="38" style="display: block; border: 0; margin: 0 auto; width: 96px; height: 38px; max-width: 96px; outline: none;" />
                </div>

                <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11.5px; color: #71717a; margin-top: 10px; margin-bottom: 16px; border: 0;">
                  Volg ons voor dagelijkse inspiratie
                </div>

                <!-- Social Media Channels (Outlook-bulletproof inline links inside cells) -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 22px auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0; border: none; mso-border-alt: none;">
                  <tr>
                    <!-- TikTok -->
                    <td align="center" valign="middle" style="padding: 4px 5px; border: 0; border: none; mso-border-alt: none;" class="mobile-social-col">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e4e4e7; mso-border-alt: solid #e4e4e7 1pt; border-radius: 20px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                        <tr>
                          <td align="center" valign="middle" style="padding: 7px 14px; border: 0; border: none; mso-border-alt: none; mso-padding-alt: 7px 14px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0;">
                              <tr>
                                <td valign="middle" align="center" style="padding-right: 7px; border: 0; line-height: 1;">
                                  <a href="https://www.tiktok.com/@asianspices0" target="_blank" style="text-decoration: none; display: inline-block; border: 0; outline: none;">
                                    <img src="${tiktokIconSrc}" alt="TikTok" width="16" height="16" style="display: block; border: 0; outline: none; width: 16px; height: 16px;" />
                                  </a>
                                </td>
                                <td valign="middle" align="left" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; color: #18181b; line-height: 16px; white-space: nowrap; border: 0;">
                                  <a href="https://www.tiktok.com/@asianspices0" target="_blank" style="text-decoration: none; color: #18181b; display: inline-block; border: 0; outline: none;">
                                    TikTok
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>

                    <!-- Instagram -->
                    <td align="center" valign="middle" style="padding: 4px 5px; border: 0; border: none; mso-border-alt: none;" class="mobile-social-col">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e4e4e7; mso-border-alt: solid #e4e4e7 1pt; border-radius: 20px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                        <tr>
                          <td align="center" valign="middle" style="padding: 7px 14px; border: 0; border: none; mso-border-alt: none; mso-padding-alt: 7px 14px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0;">
                              <tr>
                                <td valign="middle" align="center" style="padding-right: 7px; border: 0; line-height: 1;">
                                  <a href="https://www.instagram.com/asianspicessocial/" target="_blank" style="text-decoration: none; display: inline-block; border: 0; outline: none;">
                                    <img src="${instagramIconSrc}" alt="Instagram" width="16" height="16" style="display: block; border: 0; outline: none; width: 16px; height: 16px;" />
                                  </a>
                                </td>
                                <td valign="middle" align="left" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; color: #18181b; line-height: 16px; white-space: nowrap; border: 0;">
                                  <a href="https://www.instagram.com/asianspicessocial/" target="_blank" style="text-decoration: none; color: #18181b; display: inline-block; border: 0; outline: none;">
                                    Instagram
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>

                    <!-- Facebook -->
                    <td align="center" valign="middle" style="padding: 4px 5px; border: 0; border: none; mso-border-alt: none;" class="mobile-social-col">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e4e4e7; mso-border-alt: solid #e4e4e7 1pt; border-radius: 20px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                        <tr>
                          <td align="center" valign="middle" style="padding: 7px 14px; border: 0; border: none; mso-border-alt: none; mso-padding-alt: 7px 14px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0;">
                              <tr>
                                <td valign="middle" align="center" style="padding-right: 7px; border: 0; line-height: 1;">
                                  <a href="https://www.facebook.com/asianspices.online/" target="_blank" style="text-decoration: none; display: inline-block; border: 0; outline: none;">
                                    <img src="${facebookIconSrc}" alt="Facebook" width="16" height="16" style="display: block; border: 0; outline: none; width: 16px; height: 16px;" />
                                  </a>
                                </td>
                                <td valign="middle" align="left" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; color: #18181b; line-height: 16px; white-space: nowrap; border: 0;">
                                  <a href="https://www.facebook.com/asianspices.online/" target="_blank" style="text-decoration: none; color: #18181b; display: inline-block; border: 0; outline: none;">
                                    Facebook
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>

                    <!-- YouTube -->
                    <td align="center" valign="middle" style="padding: 4px 5px; border: 0; border: none; mso-border-alt: none;" class="mobile-social-col">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e4e4e7; mso-border-alt: solid #e4e4e7 1pt; border-radius: 20px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                        <tr>
                          <td align="center" valign="middle" style="padding: 7px 14px; border: 0; border: none; mso-border-alt: none; mso-padding-alt: 7px 14px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: 0;">
                              <tr>
                                <td valign="middle" align="center" style="padding-right: 7px; border: 0; line-height: 1;">
                                  <a href="https://www.youtube.com/@AsianSpices-p5c" target="_blank" style="text-decoration: none; display: inline-block; border: 0; outline: none;">
                                    <img src="${youtubeIconSrc}" alt="YouTube" width="16" height="16" style="display: block; border: 0; outline: none; width: 16px; height: 16px;" />
                                  </a>
                                </td>
                                <td valign="middle" align="left" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; color: #18181b; line-height: 16px; white-space: nowrap; border: 0;">
                                  <a href="https://www.youtube.com/@AsianSpices-p5c" target="_blank" style="text-decoration: none; color: #18181b; display: inline-block; border: 0; outline: none;">
                                    YouTube
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

                <!-- Divider -->
                <div style="border-top: 1px solid #e5e7eb; width: 85%; margin: 0 auto 18px auto;"></div>

                <!-- Sign-off with Clean Spacing -->
                <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 20px; color: #52525b; border: 0;">
                  ${signoff}
                </div>

                ${subtext ? `
                <p style="margin: 14px auto 0 auto; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 10.5px; line-height: 17px; mso-line-height-rule: exactly; color: #a1a1aa; max-width: 460px; border: 0;">
                  ${subtext}
                </p>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
  `;
}
