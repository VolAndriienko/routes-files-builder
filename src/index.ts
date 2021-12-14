import { PathsFilter } from './filters/paths.filter';
import { RobotsBuilder } from './builders/robots.builder';
import { RoutesBuilder } from './builders/routes.builder';
import { SitemapBuilder } from './builders/sitemap.builder';
import { ContentBuilder, FilesRoutesBuilderInput, mergeWithDefaultConfiguration } from './shared';

/**
 * Entry point for library
 * @param input Please check NgRoutesInput interface for more details.
 * // contains strings that allows you to parse routing files
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
 */
export const start = (input: Partial<FilesRoutesBuilderInput>) => {
  const inputData = mergeWithDefaultConfiguration(input);
  const { files: { routes, sitemap, robots }, hostname, create } = inputData;

  if (!hostname) {
    throw Error('Please specify hostname, it is required');
  }

  try {
    const paths = new PathsFilter(inputData);
    const { isRoutesPages, isSitemapPages } = paths;

    if (create.routes && isRoutesPages) {
      new RoutesBuilder(paths, routes).build();
    } else if (create.routes) {
      ContentBuilder.logNotCreated(routes);
    }

    if (create.sitemap && isSitemapPages) {
      new SitemapBuilder(paths, sitemap).build();
    } else if (create.sitemap) {
      ContentBuilder.logNotCreated(sitemap);
    }

    if (create.robots) {
      new RobotsBuilder(paths, robots).build();
    } else if (create.robots) {
      ContentBuilder.logNotCreated(robots);
    }

  } catch (err) {
    console.error(err);
    //console.error('Can not retrieve route paths from routing module');
    //console.error('Error while reading or parsing the file');
  }
}