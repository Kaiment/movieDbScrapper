const rp = require('request-promise');
const $ = require('cheerio');

const uri = 'https://www.themoviedb.org';

async function getSeason(panel) {
  const { href: hrefSeason } = panel.children[1].attribs;
  let hrefPoster = null;
  if (panel.children[1].children[1].attribs['data-srcset']) {
    [,, hrefPoster] = panel.children[1].children[1].attribs['data-srcset'].split(' ');
  }
  const panelText = panel.children[3].children[1];
  const { data: title } = panelText.children[1].children[0].children[0];
  const releaseDateNbEpisodes = panelText.children[3].children[0].data.split('|').map(e => e.trim());
  const releaseDate = parseInt(releaseDateNbEpisodes[0], 10);
  const nbEpisodes = parseInt(releaseDateNbEpisodes[1].split(' ')[0], 10);
  let recap = null;
  if (panelText.children[5].children[3]) {
    recap = panelText.children[5].children[3].children[0].data;
  }
  return {
    title,
    hrefSeason,
    hrefPoster,
    releaseDate,
    nbEpisodes,
    recap,
  };
}

async function getSeasons(url) {
  const html = await rp(`${uri}${url}`);
  const seasonPanels = $('.season_wrapper > .season > .season', html).toArray();
  let seasons = [];
  for (let i = 0; i < seasonPanels.length; i += 1) {
    seasons.push(getSeason(seasonPanels[i]));
  }
  try {
    seasons = Promise.all(seasons);
    return seasons;
  } catch (e) {
    throw e;
  }
}

async function getEpisodeInfos(card) {
  let hrefThumbnail = null;
  if (card.children[1].children[1].children[1].attribs['data-srcset']) {
    [,, hrefThumbnail] = card.children[1].children[1].children[1].attribs['data-srcset'].split(' ');
  }
  const info = card.children[3].children[1];
  const { data: title } = info.children[1].children[1].children[5].children[0].children[0];
  const { data: recap } = info.children[3].children[1].children[0];
  const episodeNumber = parseInt(info.children[1].children[1].children[1].children[0].data, 10);
  let releaseDate = null;
  if (info.children[1].children[3].children[0]) {
    releaseDate = info.children[1].children[3].children[0].data;
  }
  return {
    title,
    hrefThumbnail,
    episodeNumber,
    recap,
    releaseDate,
  };
}

const tvShowsScrapper = {
  async getEpisodesinfos(url) {
    const html = await rp(url);
    const cards = await $('.card > .episode', html).toArray();
    const promises = [];
    for (let i = 0; i < cards.length; i += 1) {
      promises.push(getEpisodeInfos(cards[i]));
    }
    try {
      const episodes = await Promise.all(promises);
      return episodes;
    } catch (e) {
      throw e;
    }
  },
  async getShowAllEpisodes(url) {
    const html = await rp(url);
    let seasonsUrl = await $('.panel.season > .new_button > a', html);
    seasonsUrl = seasonsUrl['0'].attribs.href;
    const seasons = await getSeasons(seasonsUrl);
    let episodes = [];
    for (let i = 0; i < seasons.length; i += 1) {
      episodes.push(this.getEpisodesinfos(`${uri}${seasons[i].hrefSeason}`));
    }
    try {
      episodes = await Promise.all(episodes);
      for (let j = 0; j < seasons.length; j += 1) {
        seasons[j].episodes = episodes[j];
      }
      return seasons;
    } catch (e) {
      throw e;
    }
  },
};

module.exports = tvShowsScrapper;
