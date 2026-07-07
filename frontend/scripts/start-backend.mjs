import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "../../backend");
const python =
  process.platform === "win32"
    ? path.join(backendDir, ".venv", "Scripts", "python.exe")
    : path.join(backendDir, ".venv", "bin", "python");

const child = spawn(
  python,
  ["-m", "flask", "--app", "app.main", "run", "--port", "8000"],
  {
    cwd: backendDir,
    stdio: "inherit",
    shell: false,
  },
);

child.on("exit", (code) => process.exit(code ?? 0));
