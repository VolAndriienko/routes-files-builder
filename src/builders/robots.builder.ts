import { PathsFilter } from "../filters/paths.filter";
import { ContentBuilder, FileSaveOptions } from "../shared";

export class RobotsBuilder extends ContentBuilder {
  constructor(
    public paths: PathsFilter,
    public file: FileSaveOptions
  ) {
    super(paths, file);
  }

  protected getContent() {
    const { robotsDisallowedPages, input: { langs, hostname, files: { sitemap } } } = this.paths;

    const result = [
      'User-agent: *',
      langs
        .map(lang => robotsDisallowedPages
          .map(page => `Disallow: /${lang}${page}`).join('\n')
        ).join('\n'),
      `Sitemap: ${hostname}/${sitemap.name}`
    ].join('\n');

    return result;
  }
}