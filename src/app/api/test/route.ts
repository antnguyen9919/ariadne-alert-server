import esClient from "@/lib/elasticsearch";
import { NextRequest } from "next/server";
import { getUnixTime } from "date-fns";
export async function GET(request: NextRequest) {
  try {
    // const data = await esClient.index({
    //   index: "temporary_phone_number",
    //   id: "current_phone_number",
    //   body: {
    //     phone_number: "+4917641317141",
    //     updated_at: getUnixTime(new Date()),
    //   },
    // });
    const data = await esClient
      .get({
        index: "temporary_phone_number",
        id: "current_phone_number",
      })
      .then((res) => res.body);
    // const data = await esClient.indices
    //   .create({
    //     index: "temporary_phone_number",
    //     body: {
    //       mappings: {
    //         properties: {
    //           phone_number: {
    //             type: "text",
    //           },
    //           updated_at: {
    //             type: "date",
    //             format: "epoch_second",
    //           },
    //         },
    //       },
    //     },
    //   })
    //   .then((res) => res.body);
    return Response.json({ data });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
