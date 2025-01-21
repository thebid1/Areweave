import fs from "fs";
import readline from "readline/promises";
import { ArweaveSigner, TurboFactory } from "@ardrive/turbo-sdk";

const signer = new ArweaveSigner(JSON.parse(fs.readFileSync("./key.json", { encoding: "utf-8" })));
const turbo = TurboFactory.authenticated({ signer });

const filePath = new URL(process.argv[2], import.meta.url).pathname;
const fileSize = fs.statSync(filePath).size;

console.log(`File Path: ${filePath}`);
console.log(`File Size: ${fileSize / 1024} KiB`);

if (fileSize / 1024 > 100) {
  const [costs] = await turbo.getUploadCosts({ bytes: [fileSize] });
  console.log(`Upload Costs: ${costs.winc / 1_000_000_000_000} TC`);
}

const answer = await readline
  .createInterface(process.stdin, process.stdout)
  .question("Do you want to start the upload? (y/n) ");

if (answer != "y") process.exit(0);

const uploadResult = await turbo.uploadFile({
  fileStreamFactory: () => fs.createReadStream(filePath),
  fileSizeFactory: () => fileSize,
});

console.log(`https://arweave.developerdao.com/${uploadResult.id}`);
