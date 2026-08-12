const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const generated = "C:/Users/Dell/.codex/generated_images/019f9869-8886-7643-ad70-136535f486cd";
const jobs = [
  {
    source: path.join(generated, "exec-d7ee5c3c-8354-4d83-924d-4f7f6816586b.png"),
    name: "festival-nautico-cartagena-2026",
  },
  {
    source: path.join(generated, "exec-6497ff90-ad93-4525-9fa9-de3f3da4b998.png"),
    name: "navidad-cartagena-2026",
  },
];

async function run() {
  for (const job of jobs) {
    const article = path.join(root, "images", "blog", `${job.name}.webp`);
    const card = path.join(root, "images", "blog", `${job.name}-card.webp`);
    await sharp(job.source)
      .resize(1600, 900, { fit: "cover", position: "centre" })
      .webp({ quality: 74, effort: 6 })
      .toFile(article);
    await sharp(job.source)
      .resize(720, 405, { fit: "cover", position: "centre" })
      .webp({ quality: 72, effort: 6 })
      .toFile(card);
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
