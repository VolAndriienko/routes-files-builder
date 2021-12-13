import { PathsFilter } from './filters/paths.filter';
import { RobotsBuilder } from './builders/robots.builder';
import { RoutesBuilder } from './builders/routes.builder';
import { SitemapBuilder } from './builders/sitemap.builder';
import { mergeWithDefaultConfiguration, NgRoutesInput } from './shared';

export const start = (input: Partial<NgRoutesInput>) => {
  const inputData = mergeWithDefaultConfiguration(input);
  const { files: { routes, sitemap, robots }, hostname } = inputData;

  if (!hostname) {
    throw Error('Please specify hostname, it is required');
  }

  try {
    const paths = new PathsFilter(inputData);
    const { allPages } = paths;

    if (allPages && allPages.length) {

      new RoutesBuilder(paths, routes).build();
      new SitemapBuilder(paths, sitemap).build();
      new RobotsBuilder(paths, robots).build();

    } else {
      throw Error('No pages found');
    }

  } catch (err) {
    console.error(err);
    //console.error('Can not retrieve route paths from routing module');
    //console.error('Error while reading or parsing the file');
  }
}