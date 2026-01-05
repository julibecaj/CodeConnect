//resend.com

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.contacts.create({
      email,
      properties: { source: "codeconnect-coming-soon" },
    });

    const fromName = process.env.RESEND_FROM_NAME || "CodeConnect";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@codeconnect.space";

    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: email,
      subject: "You're on the CodeConnect waitlist",
      html: `
        <div style="background:#f7f9fb;padding:32px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.12);font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;color:#0f172a;">
                  <tr>
                    <td style="padding:28px 32px;background:linear-gradient(135deg,#0f172a 0%,#12b886 100%);color:#e8f8f1;">
                      <div style="font-size:13px;letter-spacing:0.04em;text-transform:uppercase;opacity:0.85;">CodeConnect</div>
                      <h1 style="margin:6px 0 10px;font-size:26px;font-weight:700;line-height:1.2;">You're on the list.</h1>
                      <p style="margin:0;font-size:15px;line-height:1.6;max-width:520px;">Thanks for joining the CodeConnect waitlist. You'll be among the first to explore how builders, founders, and devs ship together.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:26px 32px;">
                      <p style="margin:0 0 14px;font-size:16px;font-weight:600;">What to expect</p>
                      <ul style="margin:0 0 20px;padding-left:18px;line-height:1.6;font-size:15px;color:#1f2a3d;">
                        <li>Early access to the community feed, projects, and collab tools.</li>
                        <li>Signals when new drops, betas, or partner invites go live.</li>
                        <li>Tips from the team on getting the most out of CodeConnect.</li>
                      </ul>

                      <div style="margin:20px 0;">
                        <a href="https://codeconnect.space" style="display:inline-block;padding:12px 18px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">Preview what we're building</a>
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:18px 0 6px;">
                        <tr>
                          <td style="padding:14px 16px;border:1px solid #e4e9f1;border-radius:12px;background:#fbfcfe;">
                            <div style="font-size:15px;font-weight:600;margin:0 0 6px;">Got a project or team?</div>
                            <div style="margin:0;font-size:14px;line-height:1.6;color:#30405a;">Reply to this email with what you're building and we'll prioritize your invite.</div>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:20px 0 0;font-size:14px;color:#5b6b7c;">If this wasn't you, ignore this email and you won't hear from us again.</p>
                      <p style="margin:6px 0 0;font-size:13px;color:#8a97a8;">Sent with care by the CodeConnect team.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
      text:
        "Thanks for joining the CodeConnect waitlist! You'll get early access, product drops, and tips from the team. Preview what we're building: https://codeconnect.space. If this wasn't you, ignore this email.",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
