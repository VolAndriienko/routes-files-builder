import { appendFileSync, existsSync, mkdirSync } from "fs";
import { PathsFilter } from "./filters/paths.filter";

// if true means file will be created
export interface CreateOptions {
  routes: boolean; // default true
  sitemap: boolean; // default true
  robots: boolean; // default true
}

// it can be used instead of the routing file
export interface PathOptions extends CreateOptions {
  sitemapCustomLangs: string[]; // first, means default
}

export interface SitemapOptions {
  lastmod: string; // default is today, date of last modification
  priorities: Record<string, string>; // default { '': '1.0' }, use path with '/' at start
  defaultPriority: string; // default '0.8'
  // if path is not specified in the "priorities" then defaultPriority will be used
}

// these values will be used inside comments for marking sitemap options
//https://www.sitemaps.org/protocol.html
export interface SitemapConsts {
  sitemapIgnore: string; // default "sitemap-ignore", use it for ignore path
  sitemapOnlyForLang: string; // default sitemap-only-for-langs:"
  // use it to specify custom langs for path
  // f.e "sitemap-only-for-langs:de,en" - de will be default lang
}

export interface RobotsConsts {
  robotsDisallowed: string; // default robots-disallowed, path will be added as disallowed to robots
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

export interface FilesRoutesBuilderInput {
  // contains strings that allows you to parse routing files
  consts: Partial<AllConsts>;

  // path tp app-routing.module.ts file, that will be used as base for create paths
  routingFilePath: string; 

  // if you provide paths with routingFilePath then they will be combined
  paths: Record<string, Partial<PathOptions>>; 

  // it's a path that webapp is using as base, children of this path will be the result
  pathSplitter: string;

  // name and path to save the result robots, sitemap or/and routes file.
  files: Files; 

  // f.e https://toloka.to
  hostname: string; 

  // date of the last modification, priorities and defaultPriority info
  sitemapOptions: Partial<SitemapOptions>; 

  // boolean set of of info whether need or not to create sitemap, robots or routes files.
  create: Partial<CreateOptions>; 

  // langs, that you webapp is using
  langs: string[];

  // default lang, nothing to add here
  defaultLang: string; 
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
  lastmod: new Date().toISOString().split('T')[0],
  priorities: { '': '1.0' },
  defaultPriority: '0.8'
}

const create: CreateOptions = {
  robots: true,
  routes: true,
  sitemap: true
};

export const defaultConfiguration: FilesRoutesBuilderInput = {
  hostname: '',
  routingFilePath,
  paths: {},
  defaultLang,
  langs,
  consts,
  pathSplitter,
  files,
  sitemapOptions,
  create
};

export const mergeWithDefaultConfiguration = (input: Partial<FilesRoutesBuilderInput>): FilesRoutesBuilderInput => {
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

  static logNotCreated({ name }: FileSaveOptions) {
    console.log(name + ' is not created.');
  }
}
