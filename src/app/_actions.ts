"use server";

import esClient from "@/lib/elasticsearch";
import { getUnixTime } from "date-fns";
import { revalidatePath } from "next/cache";

export async function updatePhone(phone_number: string) {
  const now_unix = getUnixTime(new Date());
  await esClient.update({
    index: "temporary_phone_number",
    id: "current_phone_number",
    refresh: "wait_for",
    body: {
      doc: {
        phone_number,
        updated_at: now_unix,
      },
    },
  });
  revalidatePath("/");
}
