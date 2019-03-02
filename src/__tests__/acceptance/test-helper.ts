import { givenHttpServerConfig, Client, supertest } from "@loopback/testlab";
import { Lb4Application } from "../../application";
import { ExpressServer } from "../../server";

export async function setupExpressApplication(): Promise<AppWithClient> {
  const server = new ExpressServer({ rest: givenHttpServerConfig() });
  await server.boot();
  await server.start();

  let lbApp = server.lbApp;

  const client = supertest("http://127.0.0.1:8000");

  return { server, client, lbApp };
}

export interface AppWithClient {
  server: ExpressServer;
  client: Client;
  lbApp: Lb4Application;
}
