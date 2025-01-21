import fs from "fs";
import Arweave from "arweave";
import { TurboFactory } from "@ardrive/turbo-sdk";

const filePath = new URL(process.argv[2], import.meta.url).pathname;
const fileSize = fs.statSync(filePath).size;

if (fileSize / 1024 > 100) {
  console.error("File bigger than 100KiB!");
  process.exit(1);
}

const arweave = new Arweave({});
const turbo = TurboFactory.authenticated({
  privateKey: await arweave.wallets.generate(),
});

const uploadResult = await turbo.uploadFile({
  fileStreamFactory: () => fs.createReadStream(filePath),
  fileSizeFactory: () => fileSize,
});

console.log(`https://arweave.developerdao.com/${uploadResult.id}`);
