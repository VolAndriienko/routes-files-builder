# routes-files-builder


## Installation
To install please run:
```
npm i -D routes-files-builder
```

## What this package can do?
This packages allows to parse Angular routing file and create with it next files:
- **routes** (for Angular Universal)
- **sitemap**
- **robots** 

Also it's possible to use instead predefined sets of routes and do not use Angular routing file.

### Requirements

The main requirement to the Angular routing file is the rule: **one path - one line**.

It means that all description of Angular Route type, should be inlined. See example below.

Keypoints:
>By default each route path will be written to the routes and sitemap files. 

>File robots will have no disallowed paths by default.

>To exclude path from sitemap - add a comment "sitemap-ignore" in the same string line.

>To add path to robots as disallowed - add a comment "robots-disallowed".

>To add path to sitemap but onlt for special langs use "sitemap-only-for-langs:de,en" comment (main will be first).

>Path with '/:' entry will be excluded from routes file.


The package expects to see inside Angular Routing file something like this:

```
....

const routes: Routes = [
  {
    path: ':lang', component: ContentComponent,
    children: [
      { path: 'lvs', component: LvsComponent, pathMatch: 'full' },
      { path: 'gigaset', component: GigasetComponent, pathMatch: 'full' },
      { path: 'barcode', component: BarcodeUndRfidComponent, pathMatch: 'full' },
      { path: 'imprint', component: ImprintComponent, pathMatch: 'full' }, // robots-disallowed sitemap-ignore
      { path: 'privacy', component: PrivacyComponent, pathMatch: 'full' }, // robots-disallowed sitemap-ignore
      { path: 'career', component: CareerComponent, pathMatch: 'full' }, // sitemap-only-for-langs:de
      { path: 'job-description/:position', component: JobDescriptionComponent, pathMatch: 'full' }, //sitemap-ignore
      { path: 'not-found', component: ErrorComponent, pathMatch: 'full' }, // robots-disallowed  sitemap-ignore
      { path: '**', component: ErrorComponent } // Wildcard route for a 404 page // sitemap-ignore
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }


```

## Usage
The library can be used in .js or .ts files.

### Typescript usage

Create file routes-files-builder.ts with next code:

```
import { start } from 'routes-files-builder'
start({});
```

And then inside the `package.json` add next script:

```
nodemon routes-files-builder.ts
```

Please check info about [nodemon](https://www.npmjs.com/package/nodemon), if you have no idea about it.

>Warning

Also, you can see next error after running script:

```
Typescript: Cannot use import statement outside a module
```

Most possibly you have `tsconfig.json` in root folder with incorrect settings for this library.

There are 2 quick options in this case - **use Javascript version** or **remove/rename/change** `tsconfig.json`.

### Javascript usage 

Create file routes-files-builder.js with next code:

```
const builder = require('routes-files-builder');
builder.start({});
```

And then inside the `package.json` add next script:

```
node routes-files-builder.js
```

I think, if you are here, you know what the **node** is.

## Input parameters

You can pass a set of parameters:
```
interface FilesRoutesBuilderInput {
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
export interface SitemapConsts {
  sitemapIgnore: string; // default "sitemap-ignore", use it for ignore path
  sitemapOnlyForLang: string; // default sitemap-only-for-langs:"
  // use it to specify custom langs for path
  // f.e "sitemap-only-for-langs:de,en" - de will be default lang
}

export interface RobotsConsts {
  robotsDisallowed: string; 
  // default robots-disallowed, path will be added as disallowed to robots
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


```


Here is the set of default values settings:

```
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
  hostname: '/',
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
```