import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

export function localRepoPath(...paths) {
  const resourcesDir = path.dirname(url.fileURLToPath(import.meta.url));
  const repoDir = path.join(resourcesDir, "..");
  return path.join(repoDir, ...paths);
}

export function makeTmpDir(name) {
  const tmpDir = path.join(os.tmpdir(), name);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir);

  return {
    tmpDirPath: (...paths) => path.join(tmpDir, ...paths),
  };
}

export function npm(options) {
  const globalOptions = options?.quiet === true ? ["--quiet"] : [];

  // `npm` points to an executable shell script; so it doesn't require a shell per se.
  // On Windows `shell: true` is required or `npm` will be picked rather than `npm.cmd`.
  // This could alternatively be handled by manually selecting `npm.cmd` on Windows.
  // See: https://github.com/nodejs/node/issues/3675 and in particular
  // https://github.com/nodejs/node/issues/3675#issuecomment-308963807.
  const npmOptions = { shell: true, ...options };

  return {
    run(...args) {
      spawn("npm", [...globalOptions, "run", ...args], npmOptions);
    },
    install(...args) {
      spawn("npm", [...globalOptions, "install", ...args], npmOptions);
    },
    ci(...args) {
      spawn("npm", [...globalOptions, "ci", ...args], npmOptions);
    },
    exec(...args) {
      spawn("npm", [...globalOptions, "exec", ...args], npmOptions);
    },
    pack(...args) {
      return spawnOutput(
        "npm",
        [...globalOptions, "pack", ...args],
        npmOptions,
      );
    },
    diff(...args) {
      return spawnOutput(
        "npm",
        [...globalOptions, "diff", ...args],
        npmOptions,
      );
    },
  };
}

export function git(options) {
  const cmdOptions = options?.quiet === true ? ["--quiet"] : [];
  return {
    clone(...args) {
      spawn("git", ["clone", ...cmdOptions, ...args], options);
    },
    checkout(...args) {
      spawn("git", ["checkout", ...cmdOptions, ...args], options);
    },
    revParse(...args) {
      return spawnOutput("git", ["rev-parse", ...cmdOptions, ...args], options);
    },
    revList(...args) {
      const allArgs = ["rev-list", ...cmdOptions, ...args];
      const result = spawnOutput("git", allArgs, options);
      return result === "" ? [] : result.split("\n");
    },
    catFile(...args) {
      return spawnOutput("git", ["cat-file", ...cmdOptions, ...args], options);
    },
    log(...args) {
      return spawnOutput("git", ["log", ...cmdOptions, ...args], options);
    },
  };
}

function spawnOutput(command, args, options) {
  const result = childProcess.spawnSync(command, args, {
    maxBuffer: 10 * 1024 * 1024, // 10MB
    stdio: ["inherit", "pipe", "inherit"],
    encoding: "utf-8",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }

  return result.stdout.toString().trimEnd();
}

export function spawn(command, args, options) {
  const result = childProcess.spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function* readdirRecursive(dirPath) {
  for (const name of fs.readdirSync(dirPath)) {
    const filepath = path.join(dirPath, name);
    const stats = fs.lstatSync(filepath);

    if (stats.isDirectory()) {
      yield* readdirRecursive(filepath);
    } else {
      yield { name, filepath, stats };
    }
  }
}

export function writeGeneratedFile(filepath, body) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, body);
}
