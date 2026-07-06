/**
 * Shared bash simulator — used by both InlineCodeEditor and PlaygroundView.
 *
 * v5.865 fix (6.9): extracted from the two duplicate copies in
 * InlineCodeEditor.tsx and PlaygroundView.tsx to eliminate drift.
 */

export function simulateBash(code: string): string[] {
  const lines = code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  const fs: Record<string, string> = {
    "/": "home  etc  usr  var  tmp",
    "/home": "user",
    "/home/user": "README.md  project.txt",
    "/home/user/README.md": "Welcome to Launchpad's simulated bash!",
    "/home/user/project.txt": "Project ideas:\n1. Build a CLI\n2. Make a web app\n3. Learn a new language",
  };
  let cwd = "/home/user";
  const output: string[] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case "echo":
        output.push(args.join(" ").replace(/['"]/g, ""));
        break;
      case "pwd":
        output.push(cwd);
        break;
      case "ls":
        output.push(fs[cwd] ?? "");
        break;
      case "cat": {
        const filepath = args[0]?.startsWith("/") ? args[0] : `${cwd}/${args[0]}`;
        output.push(fs[filepath] ?? `cat: ${args[0]}: No such file or directory`);
        break;
      }
      case "mkdir":
        output.push(`(simulated) created directory: ${args[0] ?? ""}`);
        break;
      case "touch":
        output.push(`(simulated) created file: ${args[0] ?? ""}`);
        break;
      case "grep":
        output.push(`(simulated) grep pattern: ${args[0] ?? ""}`);
        break;
      case "cd":
        if (args[0] === ".." || args[0] === "/") {
          cwd = args[0] === "/" ? "/" : cwd.split("/").slice(0, -1).join("/") || "/";
        } else if (args[0]) {
          cwd = args[0].startsWith("/") ? args[0] : `${cwd}/${args[0]}`;
        }
        break;
      default:
        output.push(`(simulated) command not recognized: ${cmd}. Supported: echo, pwd, ls, cat, mkdir, touch, grep, cd`);
    }
  }
  return output;
}
