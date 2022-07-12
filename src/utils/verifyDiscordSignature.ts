// partially stolen from https://github.com/advaith1/activities/blob/main/src/verify.ts 🙏

const key = crypto.subtle.importKey("raw", hex2bin(DISCORD_PUBLIC_KEY), { name: "NODE-ED25519", namedCurve: "NODE-ED25519" }, true, ["verify"]);
const encoder = new TextEncoder();

export default async function verifyDiscordSignature(request: Request): Promise<boolean> {
  const signature = hex2bin(request.headers.get("X-Signature-Ed25519")!);
  const timestamp = request.headers.get("X-Signature-Timestamp")!;
  const body = await request.clone().text();

  return crypto.subtle.verify("NODE-ED25519", await key, signature, encoder.encode(timestamp + body));
}

function hex2bin(hex: string): Uint8Array {
  const buf = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < buf.length; i += 1) {
    buf[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return buf;
}
