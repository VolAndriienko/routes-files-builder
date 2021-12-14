import { PathsFilter } from "../filters/paths.filter";
import { ContentBuilder, defaultConfiguration, FileSaveOptions } from "../shared";

export class RoutesBuilder extends ContentBuilder {
  constructor(
    public paths: PathsFilter,
    public file: FileSaveOptions
  ) {
    super(paths, file);
  }

  protected getContent() {
    const {
      routesPages,
      input: {
        langs = defaultConfiguration.langs
      }
    } = this.paths;

    //console.log('Filtered Routes found: \n')
    //console.log('"' + sitemapPages.join('"\n"') + '"');

    //console.log('Total Routes found: \n')
    //console.log('"' + allPages.join('"\n"') + '"');

    const result = langs.map(lang =>
      routesPages.map(page =>
        `/${lang}${page}`).join('\n')).join('\n');

    return result;
  }
}