import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';

import { format } from 'prettier';

import prettierConfig from '../.prettierrc.json' with { type: 'json' };

export function localRepoPath(...paths) {
  const resourcesDir = path.dirname(url.fileURLToPath(import.meta.url));
  const repoDir = path.join(resourcesDir, '..');
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
  const globalOptions = options?.quiet === true ? ['--quiet'] : [];

  return {
    run(...args) {
      spawn('npm', [...globalOptions, 'run', ...args], options);
    },
    install(...args) {
      spawn('npm', [...globalOptions, 'install', ...args], options);
    },
    ci(...args) {
      spawn('npm', [...globalOptions, 'ci', ...args], options);
    },
    exec(...args) {
      spawn('npm', [...globalOptions, 'exec', ...args], options);
    },
    pack(...args) {
      return spawnOutput('npm', [...globalOptions, 'pack', ...args], options);
    },
    diff(...args) {
      return spawnOutput('npm', [...globalOptions, 'diff', ...args], options);
    },
  };
}

export function git(options) {
  const cmdOptions = options?.quiet === true ? ['--quiet'] : [];
  return {
    clone(...args) {
      spawn('git', ['clone', ...cmdOptions, ...args], options);
    },
    checkout(...args) {
      spawn('git', ['checkout', ...cmdOptions, ...args], options);
    },
    revParse(...args) {
      return spawnOutput('git', ['rev-parse', ...cmdOptions, ...args], options);
    },
    revList(...args) {
      const allArgs = ['rev-list', ...cmdOptions, ...args];
      const result = spawnOutput('git', allArgs, options);
      return result === '' ? [] : result.split('\n');
    },
    catFile(...args) {
      return spawnOutput('git', ['cat-file', ...cmdOptions, ...args], options);
    },
    log(...args) {
      return spawnOutput('git', ['log', ...cmdOptions, ...args], options);
    },
  };
}

function spawnOutput(command, args, options) {
  const result = childProcess.spawnSync(command, args, {
    maxBuffer: 10 * 1024 * 1024, // 10MB
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }

  return result.stdout.toString().trimEnd();
}

export function spawn(command, args, options) {
  const result = childProcess.spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

export async function writeGeneratedFile(filepath, body) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  const formatted = await format(body, {
    filepath,
    ...prettierConfig,
  });
  fs.writeFileSync(filepath, formatted);
}
