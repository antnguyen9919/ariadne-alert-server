const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN;

import Client from "twilio";

const twilio = Client(accountSid, authToken);

export default twilio;
