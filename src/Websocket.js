import { w3cwebsocket as W3CWebSocket} from "websocket";

export const Client = new W3CWebSocket('ws://localhost:8088/ws');
