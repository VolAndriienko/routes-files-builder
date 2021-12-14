import { start } from '../src/index'
import { CreateOptions, FilesRoutesBuilderInput } from '../src/shared';
import * as settings from './settings.json'

const create: CreateOptions = { robots: true, sitemap: true, routes: true };

const set: Partial<FilesRoutesBuilderInput> = {
  ...settings,
  sitemapOptions: {
    defaultPriority: '1.0',
    priorities: {}
  },
  paths: {
    'test1': { ...create },
    'test2': { ...create, sitemap: false },
    'test3': { ...create, routes: false },
    'test4': { ...create, robots: false },
    'test5': { sitemapCustomLangs: ['fr', 'gb'] },
  },
  create
}

start(set);