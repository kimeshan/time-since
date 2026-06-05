import fs from "fs";
import path from "path";
import { parseTrophies } from "@/lib/trophies";
import TimeSinceApp from "@/components/TimeSinceApp";

// Server component: read the committed text dataset and parse it at build time.
// No database — see data/trophies.csv and planning/DATA_MODEL.md.
export default function Home() {
  const csv = fs.readFileSync(
    path.join(process.cwd(), "data", "trophies.csv"),
    "utf-8"
  );
  const clubs = parseTrophies(csv);

  return <TimeSinceApp clubs={clubs} />;
}
