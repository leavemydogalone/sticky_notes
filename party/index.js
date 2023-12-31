import { rateLimit } from "./limiter";
/* eslint-env browser */

// @ts-check
// Optional JS type checking, powered by TypeScript.
/** @typedef {import("partykit/server").Party} Party */
/** @typedef {import("partykit/server").Server} Server */
/** @typedef {import("partykit/server").Connection} Connection */
/** @typedef {import("partykit/server").ConnectionContext} ConnectionContext */

/**
 * @implements {Server}
 */
class PartyServer {
  /**
   * @param {Party} party - The Party object.
   */
  constructor(party) {
    /** @type {Party} */
    this.party = party;
  }
  clicks = 0;
  async onStart() {
    this.clicks = (await this.party.storage.get("clicks")) ?? 0;
  }
  /**
   * @param {Connection} conn - The connection object.
   * @param {ConnectionContext} ctx - The context object.
   */
  onConnect(conn, ctx) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${ctx.request.url.pathname}`
    );

    // Send a message to the connection
    // new URL(ctx.request.url).pathname
    conn.send(`${this.clicks}`);
  }

  /**
   * @param {string} message
   * @param {Connection} sender
   */
  onMessage(message, sender) {
    rateLimit(sender, 1000, () => {
      console.log(`connection ${sender.id} sent message: ${message}`);
      this.clicks += 1;
      // Broadcast the received message to all other connections in the room except the sender
      this.party.broadcast(`${this.clicks}`);
      this.party.storage.put("clicks", this.clicks + 1);
    });
  }
}

export default PartyServer;
