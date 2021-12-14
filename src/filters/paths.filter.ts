import { readFileSync } from "fs";
import { defaultConfiguration, FilesRoutesBuilderInput } from "../shared";

export class PathsFilter {
  routesPages: string[] = [];
  sitemapPages: string[] = [];
  robotsDisallowedPages: string[] = [];
  sitemapCustomLangPages: Record<string, string[]> = {};

  private customPages: string[] = [];
  private customLangs: string[][] = [];
  private pathsBeforeFiltering: string[] = [];

  isRoutesPages = false;
  isSitemapPages = false;
  isRobotsPages = false;

  /**
   * It works pretty simple - in routingFile will be found pathSplitter
   * then every string line which contains `path: '..anything...'`
   * @param input
   */
  constructor(public input: FilesRoutesBuilderInput) {
    const {
      routingFilePath = defaultConfiguration.routingFilePath,
      paths = defaultConfiguration.paths
    } = this.input;

    if (routingFilePath) {
      this.pathsBeforeFiltering = this.getPathsBeforeFiltering();
      this.routesPages = this.get(this.filterRoutesPages);
      this.sitemapPages = this.get(this.filterSitemap);
      this.robotsDisallowedPages = this.get(this.filterRobotsDisallowed);
      this.customPages = this.get(this.filterCustomPages);
      this.customLangs = this.filterCustomLangs();

      this.sitemapCustomLangPages = this.getSitemapLangsPages();
    }

    if (Object.keys(paths).length) {
      this.parseInputPaths();
    }

    this.setIsAvailable();
  }

  private setIsAvailable() {
    this.isSitemapPages = !!(this.sitemapPages.length || Object.keys(this.sitemapCustomLangPages).length);
    this.isRobotsPages = !!this.robotsDisallowedPages.length;
    this.isRoutesPages = !!this.routesPages.length;
  }

  private parseInputPaths() {
    const { paths = defaultConfiguration.paths } = this.input;

    Object.keys(paths).forEach(path => {
      const { robots, routes, sitemap, sitemapCustomLangs = [] } = paths[path];

      path = this.getPath(path);

      if (routes && !this.routesPages.includes(path)) {
        this.routesPages.push(path);
      }

      if (sitemap && !this.sitemapPages.includes(path)) {
        this.sitemapPages.push(path);
      }

      if (robots && !this.robotsDisallowedPages.includes(path)) {
        this.robotsDisallowedPages.push(path);
      }

      if (sitemapCustomLangs.length && !this.sitemapCustomLangPages[path]) {
        this.sitemapCustomLangPages[path] = sitemapCustomLangs;
      }
    });
  }
  /**
   * Returns lines of Angular Routing file with paths inside
   * */
  private getPathsBeforeFiltering(): string[] {
    const {
      routingFilePath = defaultConfiguration.routingFilePath,
      pathSplitter = defaultConfiguration.pathSplitter
    } = this.input;

    return readFileSync(routingFilePath, 'utf-8')
      .split(pathSplitter)[1]
      .split('[')[1] // get first children set
      .split(']')[0]
      .split('\n') // and split it by lines
      .map(x => x.trim())
      .filter(x => x && !x.startsWith('/')); // ignore comments
  }

  /**
   * Returns paths array from , f.e ['', '/data1', '/data2']
   * @param filteredPathsLines - result of getPathsBeforeFiltering 
   */
  private getPathsAfterFiltering(filteredPathsLines: string[]) {
    // for Angular Routing file it's the path property with ':' ignore spaces
    const pathProperty = 'path:';

    return filteredPathsLines
      // ignore error redirects
      .filter(item => item.indexOf('**') === -1)
      .map(item => {
        const lineWithoutSpaces = item.split('').filter(char => char !== ' ').join('');

        if (lineWithoutSpaces.indexOf(pathProperty) > -1) { // path is 
          const result = lineWithoutSpaces.split(pathProperty)[1];
          const splitter = result[0]; // ", ' or `

          // get path inside string brackets
          return result.split(splitter)[1].split(splitter)[0];
        }

        return undefined;
      })
      .filter(item => item !== undefined)
      .map(path => this.getPath(path));
  }

  /**
   * Final path result, should be starts with '/' and shouldn't end with it.
   * Examples: '/start', '/main', '/price'. If empty - '' without '/', for paths like /en
   * @param path Expected inputs like '/start', 'start', '/start/' or ''
   */
  private getPath(path: string) {
    let result = path && !path.startsWith('/') ? '/' + path : path;
    if (result.endsWith('/')) {
      result = result.slice(0, -1); // remove last
    }

    return result;
  }

  /**
   * Apply filter method and return only paths strings from a file
   * @param filter Filter only concrete file using const like 'sitemap-ignore'
   */
  private get(filter: () => string[]) {
    const filtered = filter.bind(this)();
    const result = this.getPathsAfterFiltering(filtered);
    return result;
  }

  private filterSitemap = (): string[] => {
    const {
      sitemapIgnore = defaultConfiguration.consts.sitemapIgnore,
      sitemapOnlyForLang = defaultConfiguration.consts.sitemapOnlyForLang
    } = this.input.consts;

    return this.pathsBeforeFiltering.filter(item =>
      item.indexOf(sitemapIgnore) === -1 &&
      item.indexOf(sitemapOnlyForLang) === -1)
  }

  private filterCustomPages = (): string[] => {
    const { sitemapOnlyForLang = defaultConfiguration.consts.sitemapOnlyForLang } = this.input.consts;

    return this.pathsBeforeFiltering.filter(item => item.indexOf(sitemapOnlyForLang) !== -1);
  }

  private filterCustomLangs = (): string[][] => {
    const { sitemapOnlyForLang = defaultConfiguration.consts.sitemapOnlyForLang } = this.input.consts;

    return this.pathsBeforeFiltering
      .filter(item => item.indexOf(sitemapOnlyForLang) !== -1)
      .map(item => {
        const partWithLangs = item.split(sitemapOnlyForLang)[1];
        const indexOfNextSpace = partWithLangs.indexOf(' ') > -1 ? partWithLangs.indexOf(' ') : undefined;

        return partWithLangs.substring(0, indexOfNextSpace).split(',').filter(item => item);
      });
  }

  private filterRobotsDisallowed = (): string[] => {
    const { robotsDisallowed = defaultConfiguration.consts.robotsDisallowed } = this.input.consts;

    return this.pathsBeforeFiltering.filter(item => item.indexOf(robotsDisallowed) !== -1);
  }

  private filterRoutesPages() {
    return this.pathsBeforeFiltering.filter(page => page.indexOf('/:') === -1);
  }

  private getSitemapLangsPages(): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    this.customPages.forEach((page, pageIndex) => {
      if (this.customLangs[pageIndex] && this.customLangs[pageIndex].length) {
        // page is custom it will return true f.e sitemapCustomLangPages['career'] = ['de', 'en']
        result[page] = this.customLangs[pageIndex];
      }
    });

    return result;
  }
}