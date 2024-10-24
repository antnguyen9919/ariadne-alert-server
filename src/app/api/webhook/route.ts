import { headers } from "next/headers";
import { NextRequest } from "next/server";
import twilio from "@/lib/twilio";
import esClient from "@/lib/elasticsearch";
const DEFAULT_USERNAME = process.env.DEFAULT_USERNAME as string;
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD as string;

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

  const body = await request.json();
  const phone_number = await esClient
    .get<{
      phone_number: string;
    }>({
      index: "temporary_phone_number",
      id: "current_phone_number",
    })
    .then((res) => res.body._source!.phone_number);
  await twilio.messages
    .create({
      body: JSON.stringify(body).slice(0, 1500),
      from: "whatsapp:+15039266221",
      // to: "whatsapp:+491744079675", // GP
      to: `whatsapp:${phone_number}`,
      // to: "whatsapp:+4917641317141",
    })
    .catch((error) => {
      console.log("Whatsapp error", error);
    });
  await twilio.messages
    .create({
      body: "Alert",
      from: "+15039266221",
      to: phone_number,
    })
    .catch((e) => {
      console.log("SMS error", e);
    });

  return Response.json({ status: "ok" }, { status: 200 });
}

export async function GET(request: NextRequest) {
  return Response.json({ message: "Hello World" });
}
