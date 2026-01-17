
// api/verify-otp
import Twilio from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return new Response(
        JSON.stringify({ error: "Phone and code required" }),
        { status: 400 }
      );
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code,
      });

    if (verificationCheck.status === "approved") {
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Invalid OTP" }),
      { status: 400 }
    );
  } catch (err) {
    console.error("Twilio verify error:", err);

    return new Response(
      JSON.stringify({ error: "Failed to verify OTP" }),
      { status: 500 }
    );
  }
}
