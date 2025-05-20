import { Resend } from 'npm:resend@3.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'BuyLuxeLuxury <newsletter@buyluxeluxury.com>',
      to: email,
      subject: 'Welcome to BuyLuxeLuxury!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <img src="https://your-logo-url.com/logo.png" alt="BuyLuxeLuxury" style="max-width: 200px; margin-bottom: 20px;">
          
          <h1 style="color: #B89566; margin-bottom: 20px;">Welcome to BuyLuxeLuxury!</h1>
          
          <p style="color: #333; line-height: 1.6;">
            Thank you for subscribing to our newsletter. You're now part of an exclusive community of luxury enthusiasts.
          </p>
          
          <h2 style="color: #B89566; margin-top: 30px;">What to Expect:</h2>
          <ul style="color: #333; line-height: 1.6;">
            <li>Weekly curated luxury property listings</li>
            <li>Expert insights on luxury real estate</li>
            <li>Lifestyle tips and trends</li>
            <li>Exclusive event invitations</li>
          </ul>
          
          <div style="margin: 40px 0; text-align: center;">
            <a href="https://buyluxeluxury.com/blog" 
               style="background-color: #B89566; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Explore Our Blog
            </a>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            Stay tuned for our next newsletter!
          </p>
          
          <p style="color: #333; margin-top: 30px;">
            Best regards,<br>
            The BuyLuxeLuxury Team
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>
              This email was sent to ${email}. If you didn't subscribe to our newsletter, 
              you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Welcome email sent successfully', data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});