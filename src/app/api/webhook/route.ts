import { headers } from "next/headers";
import { NextRequest } from "next/server";
import twilio from "@/lib/twilio";
import esClient from "@/lib/elasticsearch";
const DEFAULT_USERNAME = process.env.DEFAULT_USERNAME as string;
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD as string;
const contentSid = process.env.TWILIO_CONTENT_SID;
export async function POST(request: NextRequest) {
  const headersList = await headers();
  const basicAuth = headersList.get("authorization");
  const authValue = basicAuth?.split(" ")[1];
  if (!authValue) {
    return Response.json({ message: "No auth header" }, { status: 401 });
  }
  const [username, password] = Buffer.from(authValue, "base64")
    .toString("utf-8")
    .split(":");
  if (username !== DEFAULT_USERNAME || password !== DEFAULT_PASSWORD) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const grafanaPayload = await request.json();
  const phone_number = await esClient
    .get<{
      phone_number: string;
    }>({
      index: "temporary_phone_number",
      id: "current_phone_number",
    })
    .then((res) => res.body._source!.phone_number);
  const target_area = grafanaPayload.message || "Ariadne Alert";
  const whatsapp_response = await twilio.messages
    .create({
      contentSid,
      contentVariables: JSON.stringify({ "1": target_area }),
      from: "whatsapp:+15039266221",
      // to: "whatsapp:+491744079675", // GP
      to: `whatsapp:${phone_number}`,
      // to: "whatsapp:+4917641317141",
    })
    .catch((error: any) => {
      console.log("Whatsapp error: ", error.message || "No message");
    });
  const message_response = await twilio.messages
    .create({
      body: `Please go to ${target_area}`,
      from: "+15039266221",
      to: phone_number,
    })
    .catch((error: any) => {
      console.log("SMS error: ", error.message || "No message");
    });

  console.log({
    grafanaPayload,
    message_response: message_response || {},
    whatsapp_response: whatsapp_response || {},
  });
  return Response.json({ status: "ok" }, { status: 200 });
}

export async function GET(request: NextRequest) {
  return Response.json({ message: "Hello World" });
}
