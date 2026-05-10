import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // TODO: Integrate with Mailchimp / ConvertKit API
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    // const listId = process.env.MAILCHIMP_LIST_ID;
    // await mailchimp.lists.addListMember(listId, { email_address: email, status: "subscribed" });

    console.log("Subscription request for:", email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
