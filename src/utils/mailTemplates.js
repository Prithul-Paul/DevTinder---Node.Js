const sendOtpTemplateFnction = (otp)=>{
    return `
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Your One-Time Password</title>
    <style>
      /* Basic reset for email clients */
      body, table, td, a { text-decoration: none; }
      img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
      table { border-collapse: collapse !important; }
      body { margin: 0; padding: 0; background-color: #f6f7fb; }
      /* Container */
      .wrapper { width: 100%; padding: 24px 0; }
      .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.04); }
      .header { padding: 24px 28px; background: #0d6efd; color: #ffffff; font-family: Arial, Helvetica, sans-serif; }
      .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
      .content { padding: 28px; font-family: Arial, Helvetica, sans-serif; color: #333333; }
      .content p { margin: 0 0 14px; line-height: 1.6; font-size: 15px; }
      .otp-box { 
        margin: 18px 0 6px; 
        display: inline-block; 
        font-size: 28px; 
        letter-spacing: 6px; 
        font-weight: 700; 
        color: #111111; 
        background: #f1f5ff; 
        border: 1px solid #dbe4ff; 
        border-radius: 10px; 
        padding: 14px 18px; 
        font-family: "Courier New", Courier, monospace;
      }
      .muted { color: #6b7280; font-size: 12px; }
      .footer { padding: 20px 28px 28px; font-family: Arial, Helvetica, sans-serif; color: #6b7280; font-size: 12px; }
      @media (prefers-color-scheme: dark) {
        body { background-color: #0b0b0f; }
        .container { background: #16161a; box-shadow: none; }
        .header { background: #2563eb; }
        .content { color: #e5e7eb; }
        .otp-box { background:#0f172a; color:#e5e7eb; border-color:#334155; }
        .footer { color: #9ca3af; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <table role="presentation" width="100%">
        <tr>
          <td align="center">
            <table role="presentation" class="container" width="100%">
              <tr>
                <td class="header">
                  <h1>Verify your sign-in</h1>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <p>Hi,</p>
                  <p>Use the following one-time password (OTP) to complete your action. Do not share this code with anyone.</p>
                  <div class="otp-box">${otp}</div>
                  <p class="muted">This code expires in 2 minutes.</p>
                  <p>If you didn’t request this, you can safely ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  © ${new Date().getFullYear()} Your Company. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}

module.exports = {
    sendOtpTemplateFnction
}