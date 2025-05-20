import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Initialize email service (example using Supabase's built-in email service)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Send welcome email
    const { error } = await supabase.auth.admin.sendRawEmail({
      to: email,
      subject: 'Welcome to BuyLuxeLuxury!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Welcome to BuyLuxeLuxury!</h1>
          <p>Thank you for subscribing to our newsletter. Get ready for exclusive content, luxury insights, and premium property listings delivered right to your inbox.</p>
          <h2>What to Expect:</h2>
          <ul>
            <li>Weekly curated luxury property listings</li>
            <li>Expert insights on luxury real estate</li>
            <li>Lifestyle tips and trends</li>
            <li>Exclusive event invitations</li>
          </ul>
          <p>Stay tuned for our next newsletter!</p>
          <p>Best regards,<br>The BuyLuxeLuxury Team</p>
        </div>
      `,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Welcome email sent successfully' }),
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