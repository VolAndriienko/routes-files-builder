import { PathsFilter } from "../filters/paths.filter";
import { ContentBuilder, FileSaveOptions } from "../shared";

export class SitemapBuilder extends ContentBuilder {
  constructor(
    public paths: PathsFilter,
    public file: FileSaveOptions
  ) {
    super(paths, file);
  }

  protected getContent() {
    const { sitemapPages, sitemapCustomLangPages, input: { langs, defaultLang } } = this.paths;

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapPages.map(page => this.getUrl(page, langs, defaultLang)).join('\n')}
${Object.keys(sitemapCustomLangPages).map(page =>
      this.getUrl(page, sitemapCustomLangPages[page], sitemapCustomLangPages[page][0])).join('\n')}
</urlset>`
  };

  private getUrl(page, availableLangs, defaultLangValue) {
    const { hostname, sitemapOptions: { defaultPriority, priorities, lastmod } } = this.paths.input;

    return availableLangs.map(currentLang =>
      `  <url>
    <loc>${hostname}/${currentLang}${page}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priorities[page] || defaultPriority}</priority>\n${availableLangs.map(lang =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${hostname}/${lang}${page}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${hostname}/${defaultLangValue}${page}"/>
  </url>
`).join('\n');
  }
}