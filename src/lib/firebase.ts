import config from "#/config";
import * as admin from "firebase-admin";
import {
  BatchResponse,
  Message,
  MulticastMessage,
} from "firebase-admin/messaging";
import { FCMMessage } from "../models/FCMMessage";
import { addFailedToken } from "./db";

const removeDevices = [
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
  "messaging/invalid-argument", // Invalid token format (eg. empty string)
];

admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccount),
});

export const messaging = admin.messaging;

export const send = async (fcmMessage: FCMMessage) => {
  if (fcmMessage.topic) {
    return messaging().send(fcmMessage as Message);
  }

  // Always multicast : failed tokens management
  if (fcmMessage.token) {
    fcmMessage.tokens = [fcmMessage.token];
    delete fcmMessage["token"];
  }

  const message = fcmMessage as MulticastMessage;

  return messaging()
    .sendEachForMulticast(fcmMessage as MulticastMessage)
    .then((response: BatchResponse) => {
      const failedTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          if (removeDevices.includes(resp.error?.code || "")) {
            failedTokens.push(message.tokens[idx]);
            addFailedToken(message.tokens[idx]);
          } else {
            console.error(
              `Failed to send message to ${message.tokens[idx]}`,
              resp.error?.toJSON(),
              fcmMessage,
            );
          }
        }
      });

      return response;
    });
};
