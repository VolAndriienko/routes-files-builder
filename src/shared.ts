import { appendFileSync, existsSync, mkdirSync } from "fs";
import { PathsFilter } from "./filters/paths.filter";

export interface SitemapOptions {
  lastmod: string;
  priorities: Record<string, string>;
  defaultPriority: string;
}

export interface SitemapConsts {
  sitemapIgnore: string;
  sitemapOnlyForLang: string;
}

export interface RobotsConsts {
  robotsDisallowed: string;
}

export interface FileSaveOptions {
  path: string;
  name: string;
}

export interface Files {
  robots: FileSaveOptions;
  sitemap: FileSaveOptions;
  routes: FileSaveOptions;
}

export interface AllConsts extends SitemapConsts, RobotsConsts { }

export interface NgRoutesInput {
  consts: AllConsts;
  routingFilePath: string;
  langs: string[];
  defaultLang: string;
  pathSplitter: string;
  files: Files;
  hostname: string;
  sitemapOptions: SitemapOptions;
}

export const routingFilePath = 'src/app/app-routing.module.ts';
export const langs = ['en', 'de', 'nl', 'pl'];
export const defaultLang = 'en';
export const pathSplitter = ':lang';

export const consts = {
  sitemapIgnore: 'sitemap-ignore',
  robotsDisallowed: 'robots-disallowed',
  sitemapOnlyForLang: 'sitemap-only-for-langs:'
}

export const files: Files = {
  routes: { name: 'routes.txt', path: '' },
  robots: { name: 'robots.txt', path: 'src/' },
  sitemap: { name: 'sitemap.xml', path: 'src/' }
};

const sitemapOptions: SitemapOptions = {
  lastmod: '2021-10-10',
  priorities: { '': '1.0' },
  defaultPriority: '0.8'
}

export const defaultConfiguration: NgRoutesInput = {
  hostname: '/',
  routingFilePath,
  defaultLang,
  langs,
  consts,
  pathSplitter,
  files,
  sitemapOptions
};

export const mergeWithDefaultConfiguration = (input: Partial<NgRoutesInput>): NgRoutesInput => {
  return input ? { ...defaultConfiguration, ...input } : defaultConfiguration;
}

export abstract class ContentBuilder {
  content = '';

  constructor(
    protected paths: PathsFilter,
    protected file: FileSaveOptions,
  ) {
    this.content = this.getContent();
  }

  public build() {
    const { name, path } = this.file;
    if (!existsSync(path)) {
      mkdirSync(path);
    }

    appendFileSync([path, name].join('/'), this.content, { flag: 'w' });
    console.log(name + ' is created');
  }

  protected abstract getContent(): string;
}

