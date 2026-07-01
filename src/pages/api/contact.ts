import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({
        message: "Missing required fields"
      }), { status: 400 });
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('messages')
      .insert([
        { name, email, subject, message }
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({
        message: "Failed to save message to database"
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      message: "Message sent successfully"
    }), { status: 200 });

  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({
      message: "Internal server error"
    }), { status: 500 });
  }
};
