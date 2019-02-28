const rp = require('request-promise');
const $ = require('cheerio');

const uri = 'https://www.themoviedb.org';

async function getActor(card) {
  const { data: actorName } = card.children[3].children[0].children[0];
  let characterName = null;
  if (card.children[5].children[0])
    characterName = card.children[5].children[0].data;
  let hrefPhoto = null;
  if (card.children[1].children[1].attribs['data-srcset']) {
    [,, hrefPhoto] = card.children[1].children[1].attribs['data-srcset'].split(' ');
  }
  return {
    actorName,
    characterName,
    hrefPhoto,
  };
}

async function getCrewMember(card) {
  const { data: crewName } = card.children[1].children[0].children[0];
  const { data: crewRole } = card.children[3].children[0];
  return {
    crewName,
    crewRole,
  };
}

// Get the casting : actor and crew
async function getCasting(html) {
  const casting = {
    actors: [],
    crew: [],
  };
  const actors = await $('.people.scroller > li', html).toArray();
  const crew = await $('.people.no_image > li', html).toArray();
  const actorPromises = [];
  const crewPromises = [];
  for (let i = 0; i < actors.length; i += 1) {
    actorPromises.push(getActor(actors[i]));
  }
  for (let i = 0; i < crew.length; i += 1) {
    crewPromises.push(getCrewMember(crew[i]));
  }
  casting.actors = await Promise.all(actorPromises);
  casting.crew = await Promise.all(crewPromises);
  return casting;
}

function getDuration(infos) {
  elements = infos.toArray()
  let ret = '';
  elements.forEach(e => {
    if (e.children[0].children[0].children) {
      if (e.children[0].children[0].children[0].data === 'Runtime') {
        ret = e.children[0].children[0].children[0].parent.parent.next.data.trim();
      }
    }
  });
  return ret;
}

// Get title, release date, poster image source, recap and score from the html
async function getMainInfo(html) {
  let promises = [];
  promises.push($('.image_content', html));
  promises.push($('.title > span > a > h2', html));
  promises.push($('.title > span > span', html));
  promises.push($('.user_score_chart', html));
  promises.push($('.overview > p', html));
  promises.push($('.facts.left_column > p', html));
  promises = await Promise.all(promises);
  const hrefPoster = promises[0]['0'].children[1].attribs['data-srcset'].split(' ')[2] ? `https://image.tmdb.org/t/p/w1280/${promises[0]['0'].children[1].attribs['data-srcset'].split(' ')[2]}` : '';
  const title = promises[1]['0'].children[0].data;
  const releaseDate = parseInt(promises[2]['0'].children[0].data.substr(1).slice(0, -1), 10);
  const score = parseInt(promises[3]['0'].attribs['data-percent'], 10);
  const recap = promises[4]['0'].children[0].data;
  const duration = getDuration(promises[5]);
  return {
    title,
    releaseDate,
    hrefPoster,
    duration,
    recap,
    score,
  };
}

// Get the data of a specific box from the recommended movies
async function getRecommendedInfos(card) {
  const { title } = card.children[1].children[1].attribs;
  const hrefPoster = card.children[1].children[1].children[1].attribs['data-src'];
  const score = parseInt(card.children[3].children[3].children[0].data.split('.').join(''), 10);
  return {
    title,
    hrefPoster,
    score,
  };
}

// Get the data of the recommended movies
async function getRecommended(html) {
  const recommended = $('.panel.recommendations.scroller > .scroller > .item.mini.backdrop.mini_card', html).toArray();
  if (recommended.length < 1)
    return [];
  const promises = [];
  for (let i = 0; i < recommended.length; i += 1) {
    promises.push(getRecommendedInfos(recommended[i]));
  }
  const ret = await Promise.all(promises);
  return ret;
}

// Get the genres of a movie
async function getGenre(html) {
  const genres = [];
  const genre = await $('.genres.right_column > ul > li', html).toArray();
  for (let i = 0; i < genre.length; i += 1) {
    genres.push(genre[i].children[0].children[0].data);
  }
  return genres;
}

async function getBackdrop(html) {
  const imagesLinks = await $('#sub_menu_images > ul > li > a', html).toArray();
  const hrefBackdrop = imagesLinks[0].attribs.href;
  const backdropHtml = await rp(`${uri}${hrefBackdrop}`);
  const backdrops = await $('a.image', backdropHtml).toArray();
  if (backdrops.length < 1)
    return null;
  return backdrops[0].attribs.href;
}

const singleMovieScrapper = {
  async getMediaInfo(url) {
    try {
      const html = await rp(url);
      const promises = [];
      promises.push(getMainInfo(html));
      promises.push(getBackdrop(html));
      promises.push(getCasting(html));
      promises.push(getGenre(html));
      promises.push(getRecommended(html));
      mainInfo = await Promise.all(promises);
      const movie = mainInfo[0];
      movie.hrefBackdrop = mainInfo[1];
      movie.casting = mainInfo[2];
      movie.genres = mainInfo[3];
      movie.recommended = mainInfo[4];
      return movie;
    } catch (e) {
      if (e.statusCode === 404) {
        throw new Error('Movie not found');
      } else {
        throw e;
      }
    }
  },
};

module.exports = singleMovieScrapper;
