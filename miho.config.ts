import { PackageManager, defineConfig } from 'miho';
import path from 'node:path';
import fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { existsSync as exists } from 'node:fs';
import { execa } from 'execa';
import { Octokit } from '@octokit/core';

export default defineConfig({
  packageManager: PackageManager.PNPM,
  recursive: false,
  commit: {
    push: true,
    all: true,
    message: (miho) => {
      const pkg = miho.getPackageByName('vndb-query');
      if (!pkg) throw new Error('No package found.');
      const { newVersion } = pkg;
      if (!newVersion) return null;
      return `chore: bump version to ${newVersion}`;
    }
  },
  jobs: {
    build: async () => {
      await execa('pnpm', ['rollup'], { stdio: 'inherit' });
      const src = path.join(process.cwd(), 'dist/src');
      if (exists(src)) await fs.rm(src, { recursive: true });
    },
    publish: async () => {
      const { version } = await import('./package.json');
      const { GITHUB_TOKEN } = await import('./config.json');
      const octokit = new Octokit({ auth: GITHUB_TOKEN });

      await octokit.request('POST /repos/{owner}/{repo}/releases', {
        tag_name: version,
        name: version,
        draft: false,
        prerelease: false,
        generate_release_notes: true,
        owner: 'ferreira-tb',
        repo: 'vndb-query',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          accept: 'application/vnd.github+json'
        }
      });
    }
  }
});
