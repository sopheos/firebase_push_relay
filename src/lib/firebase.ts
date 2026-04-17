import config from "#/config";
import * as admin from "firebase-admin";
import {
  BatchResponse,
  Message,
  MulticastMessage,
} from "firebase-admin/messaging";
import { FCMMessage } from "../models/FCMMessage";
import { addFailedToken } from "./db";

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
          failedTokens.push(message.tokens[idx]);
          addFailedToken(message.tokens[idx]);
        }
      });

      if (failedTokens) {
        console.log("List of tokens that caused failures: ", failedTokens);
      } else {
        console.log("All messages sent successfully");
      }

      return response;
    });
};
