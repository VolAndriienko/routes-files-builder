import { readFileSync } from "fs";
import { NgRoutesInput } from "../shared";

export class PathsFilter {
  allPages: string[] = [];
  sitemapPages: string[] = [];
  robotsDisallowedPages: string[] = [];

  customPages: string[] = [];
  customLangs: string[][] = [];

  sitemapCustomLangPages: Record<string, string[]> = {};

  private pathsBeforeFiltering: string[] = [];

  constructor(public input: NgRoutesInput) {
    this.pathsBeforeFiltering = this.getPathsBeforeFiltering();

    this.allPages = this.get(this.filerAllPages);
    this.sitemapPages = this.get(this.filterSitemap);
    this.robotsDisallowedPages = this.get(this.filterRobotsDisallowed);
    this.customPages = this.get(this.filterCustomPages);
    this.customLangs = this.filterCustomLangs();

    this.sitemapCustomLangPages = this.getSitemapLangsPages();
  }

  private getPathsBeforeFiltering(): string[] {
    const { routingFilePath, pathSplitter } = this.input;

    return readFileSync(routingFilePath, 'utf-8')
      .split(pathSplitter)[1]
      .split('[')[1]
      .split(']')[0]
      .split('\n')
      .map(x => x.trim())
      .filter(x => x && !x.startsWith('/'));
  }

  private getPathsAfterFiltering(filteredPaths: string[]) {

    return filteredPaths
      .filter(item => item.indexOf('**') === -1)
      .map(item => item.indexOf('path:') > -1 ?
        item.split('path')[1]
          .split('\'')[1]
          .split('\'')[0] :
        undefined)
      .filter(item => item !== undefined)
      .map(path => path ? '/' + path : path);
  }

  private get(filter: () => string[]) {
    const filtered = filter.bind(this)();
    const result = this.getPathsAfterFiltering(filtered);
    return result;
  }

  private filterSitemap = (): string[] => {
    const { sitemapIgnore, sitemapOnlyForLang } = this.input.consts;

    return this.pathsBeforeFiltering.filter(item =>
      item.indexOf(sitemapIgnore) === -1 &&
      item.indexOf(sitemapOnlyForLang) === -1)
  }

  private filterCustomPages = (): string[] => {
    const { sitemapOnlyForLang } = this.input.consts;

    return this.pathsBeforeFiltering.filter(item => item.indexOf(sitemapOnlyForLang) !== -1);
  }

  private filterCustomLangs = (): string[][] => {
    const { sitemapOnlyForLang } = this.input.consts;

    return this.pathsBeforeFiltering
      .filter(item => item.indexOf(sitemapOnlyForLang) !== -1)
      .map(item => {
        const partWithLangs = item.split(sitemapOnlyForLang)[1];
        const indexOfNextSpace = partWithLangs.indexOf(' ') > -1 ? partWithLangs.indexOf(' ') : undefined;

        return partWithLangs.substring(0, indexOfNextSpace).split(',').filter(item => item);
      });
  }

  private filterRobotsDisallowed = (): string[] => {
    const { robotsDisallowed } = this.input.consts;

    return this.pathsBeforeFiltering.filter(item => item.indexOf(robotsDisallowed) !== -1);
  }

  private filerAllPages() {
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