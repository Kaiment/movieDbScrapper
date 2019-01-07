const rp = require('request-promise');
const $ = require('cheerio');
const _ = require('lodash');
const singlePageScrapper = require('./singlePageScrapper.js');
const tvShowsScrapper = require('./tvShowsScrapper.js');

const uri = 'https://www.themoviedb.org';

function craftUrl(search, page, language) {
  return `${uri}/search?query=${search}&page=${page}&language=${language}`;
}

async function getNbPages(search, type, language) {
  const url = craftUrl(search, 1, language);
  const html = await rp(url);
  const htmlScrapped = $('.pagination > .next_page', html).toArray();
  if (htmlScrapped.length < 1) {
    return 1;
  }
  const nextPage = _.filter(htmlScrapped, e => e.attribs.href.split('/')[2].split('?')[0] === type);
  if (nextPage.length > 0) {
    return parseInt(nextPage[0].prev.prev.children[0].data, 10);
  }
  return 1;
}

function getMovieMainInfo(card) {
  const imgContent = card.children[1];
  const info = card.children[3];
  const { href } = imgContent.children[1].attribs;
  const id = parseInt(href.split('/')[2].split('?')[0], 10);
  let hrefPoster = null;
  if (imgContent.children[1].children[1].attribs['data-srcset']) {
    [,, hrefPoster] = imgContent.children[1].children[1].attribs['data-srcset'].split(' ');
  }
  const score = parseInt(info.children[1].children[1].children[1].children[1].attribs['data-percent'], 10);
  const flex = info.children[1].children[3];
  const { title } = flex.children[1].attribs;
  let releaseDate = null;
  if (flex.children[3].children[0]) {
    releaseDate = parseInt(flex.children[3].children[0].data.split(' ')[2], 10);
  }
  return {
    title,
    id,
    href,
    hrefPoster,
    releaseDate,
    score,
  };
}

async function getMediaFromPage(url, type) {
  const html = await rp(url);
  const htmlParsed = await $(`.search_results.${type} > .results.flex > .item.poster.card`, html).toArray();
  const mediasInfos = [];
  for (let i = 0; i < htmlParsed.length; i += 1) {
    mediasInfos.push(getMovieMainInfo(htmlParsed[i]));
  }
  return mediasInfos;
}

const mediaScrapper = {
  // Gets movies thumbnails infos
  // ex : getOnePageMedia('star wars', 1, 'movie') => returns all star wars movies from page 1
  // [ { title, id, href (url of the movie), hrefPoster (src of movie's poster), releaseDate,
  // score }, ...]
  async getOnePageMedia(input, page, type) {
    const search = encodeURIComponent(input);
    const url = craftUrl(search, page, 'en-US');
    const nbPages = await getNbPages(search, type, 'en-US');
    if (page < 0 || page > nbPages) {
      return [];
    }
    const medias = await getMediaFromPage(url, type);
    return medias;
  },
  // Gets a specific movie's infos
  async getMovieInfoById(id, language) {
    const correctId = parseInt(id, 10);
    const url = `${uri}/movie/${correctId}?language=${language}`;
    const ret = await singlePageScrapper.getMediaInfo(url);
    return ret;
  },
  // Gets a specific tv show's infos
  async getTvInfoById(id, language) {
    const correctId = parseInt(id, 10);
    const url = `${uri}/tv/${correctId}?language=${language}`;
    const ret = await singlePageScrapper.getMediaInfo(url);
    ret.seasons = await tvShowsScrapper.getShowAllEpisodes(url);
    return ret;
  },
};

module.exports = mediaScrapper;
