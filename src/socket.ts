import { URLS_TO_USE } from "./lib/network";

const SOCKET_URL = URLS_TO_USE.SOCKET;

class WS {
  private ws: WebSocket | null = null;

  initialize = (uniqueParam: string | null) => {
    let url = `${SOCKET_URL}/ws?type=caller_context&identifier=${uniqueParam}`;
    console.log(url);
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("Connected to WS server");
    };
  };

  addMessageEventListener = (
    callback: (this: WebSocket, ev: MessageEvent<any>) => any
  ) => {
    // this.ws?.addEventListener(event, callback);
    this.ws?.addEventListener("message", callback);
  };

  disconnect = () => {
    this.ws?.close();
    console.log("-- Disconnected ---");
  };
}

let wsService = new WS();
export default wsService;
