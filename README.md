```javascript
const movieDB = require('moviedb-scrapper-hypertube');

movieDB.getOnePageMedia('iron man', 1, 'movie').then(res => {
    console.log(res);
    // RETURNS :
    // [
    //     { title: 'Iron Man',
    //         id: 1726,
    //         href: '/movie/1726?language=en-US',
    //         hrefPoster:
    //         'https://image.tmdb.org/t/p/w370_and_h556_bestv2/848chlIWVT41VtAAgyh9bWymAYb.jpg',
    //         releaseDate: 2008,
    //         score: 75 },
    //     { title: 'Iron Man 3',
    //         id: 68721,
    //         href: '/movie/68721?language=en-US',
    //         hrefPoster:
    //         'https://image.tmdb.org/t/p/w370_and_h556_bestv2/1Ilv6ryHUv6rt9zIsbSEJUmmbEi.jpg',
    //         releaseDate: 2013,
    //         score: 69 },
    //     { title: 'Iron Man 2',
    //         id: 10138,
    //         href: '/movie/10138?language=en-US',
    //         hrefPoster:
    //         'https://image.tmdb.org/t/p/w370_and_h556_bestv2/ArqpkNYGfcTIA6umWt6xihfIZZv.jpg',
    //         releaseDate: 2010,
    //         score: 67 },
    //     { title: 'The Man in the Iron Mask',
    //         id: 9313,
    //         href: '/movie/9313?language=en-US',
    //         hrefPoster:
    //         'https://image.tmdb.org/t/p/w370_and_h556_bestv2/mNbLk9qdBMnzBFWBrjy3Nuw9Ovi.jpg',
    //         releaseDate: 1998,
    //         score: 65 },
    //     ...
    // ]
});

movieDB.getOnePageMedia('game of thrones', 1, 'tv') // TV example

const movies = await movieDB.getOnePageMedia('iron man', 1, 'movie');
const firstResult = movies[0];
movieDB.getMovieInfoById(firstResult.id, 'en-US').then((res) => {
    // RETURNS :
    // {   title: 'Iron Man',
    //     releaseDate: 2008,
    //     hrefPoster:
    //     'https://image.tmdb.org/t/p/w1280/848chlIWVT41VtAAgyh9bWymAYb.jpg',
    //     duration: '2h 6m',
    //     recap:
    //     'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates aunique weaponized suit of armor to fight evil.',
    //     score: 75,
    //     casting:
    //         { actors: [ [Object], [Object], [Object], [Object], [Object] ],
    //             crew:
    //             [ [Object],
    //                 [Object],
    //                 [Object],
    //                 [Object],
    //                 [Object],
    //                 [Object],
    //                 [Object] ] },
    //         genres: [ 'Action', 'Science Fiction', 'Adventure' ],
    //         recommended:
    //         [ { title: 'Iron Man 2',
    //             hrefPoster:
    //                 'https://image.tmdb.org/t/p/w250_and_h141_face/jxdSxqAFrdioKgXwgTs5Qfbazjq.jpg',
    //             score: 67 },
    //             { title: 'Captain America: The First Avenger',
    //             hrefPoster:
    //                 'https://image.tmdb.org/t/p/w250_and_h141_face/pmZtj1FKvQqISS6iQbkiLg5TAsr.jpg',
    //             score: 68 }
    //         ...]
    // }
})

const tvs = await movieDB.getOnePageMedia('game of thrones', 1, 'tv');
const firstResult = tvs[0];
movieDB.getTvInfoById(firstResult., 'en-US').then((res) => {
    // RETURNS :
    // {   title: 'Game of Thrones',
    //     releaseDate: 2011,
    //     hrefPoster:
    //     'https://image.tmdb.org/t/p/w1280/gwPSoYUHAKmdyVywgLpKKA4BjRr.jpg',
    //     duration: 'Scripted',
    //     recap:
    //     'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night\'s Watch, is all that stands between the realms of men and icy horrors beyond.',
    //     score: 82,
    //     casting:
    //     { actors: [ [Object], [Object], [Object], [Object], [Object] ],
    //         crew: [ [Object], [Object] ] },
    //     genres: [ 'Sci-Fi & Fantasy', 'Drama', 'Action & Adventure' ],
    //     recommended:
    //         [ { title: 'Breaking Bad',
    //             hrefPoster:
    //                 'https://image.tmdb.org/t/p/w250_and_h141_face/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg',
    //             score: 83 },
    //             { title: 'Sherlock',
    //             hrefPoster:
    //                 'https://image.tmdb.org/t/p/w250_and_h141_face/bvS50jBZXtglmLu72EAt5KgJBrL.jpg',
    //             score: 83 }
    //             ...  ],
    //     seasons:
    //         [ { title: 'Season 1',
    //             hrefSeason: '/tv/1399-game-of-thrones/season/1?language=en-US',
    //             hrefPoster:
    //                 'https://image.tmdb.org/t/p/w260_and_h390_bestv2/zwaj4egrhnXOBIit1tyb4Sbt3KP.jpg',
    //             releaseDate: 2011,
    //             nbEpisodes: 10,
    //             recap:
    //                 'Trouble is brewing in the Seven Kingdoms of Westeros. For the driven inhabitantsof this visionary world, control of Westeros\' Iron Throne holds the lure of great power.But in a land where the seasons can last a lifetime, winter is coming...and beyond the Great Wall that protects them, an ancient evil has returned. In Season One, the story centers on three primary areas: the Stark and the Lannister families, whose designs on controlling the throne threaten a tenuous peace; the dragon princess Daenerys, heir to the former dynasty, who waits just over the Narrow Sea with her malevolent brother Viserys; and the Great Wall--a massive barrier of ice where a forgotten danger is stirring.',
    //             episodes: [Array] },
    //             { title: 'Season 2',
    //             hrefSeason: '/tv/1399-game-of-thrones/season/2?language=en-US',
    //             hrefPoster:
    //                 'https://image.tmdb.org/t/p/w260_and_h390_bestv2/5tuhCkqPOT20XPwwi9NhFnC1g9R.jpg',
    //             releaseDate: 2012,
    //             nbEpisodes: 10,
    //             recap:
    //                 'The cold winds of winter are rising in Westeros...war is coming...and five kingscontinue their savage quest for control of the all-powerful Iron Throne. With winter fastapproaching, the coveted Iron Throne is occupied by the cruel Joffrey, counseled by his conniving mother Cersei and uncle Tyrion. But the Lannister hold on the Throne is under assault on many fronts. Meanwhile, a new leader is rising among the wildings outside the Great Wall, adding new perils for Jon Snow and the order of the Night\'s Watch.',
    //             episodes: [Array] },
    //             { title: 'Season 3',
    //             hrefSeason: '/tv/1399-game-of-thrones/season/3?language=en-US',
    //             hrefPoster:
    //                 'https://image.tmdb.org/t/p/w260_and_h390_bestv2/7d3vRgbmnrRQ39Qmzd66bQyY7Is.jpg',
    //             releaseDate: 2013,
    //             nbEpisodes: 10,
    //             recap:
    //                 'Duplicity and treachery...nobility and honor...conquest and triumph...and, of course, dragons. In Season 3, family and loyalty are the overarching themes as many criticalstorylines from the first two seasons come to a brutal head. Meanwhile, the Lannisters maintain their hold on King\'s Landing, though stirrings in the North threaten to alter the balance of power; Robb Stark, King of the North, faces a major calamity as he tries to build on his victories; a massive army of wildlings led by Mance Rayder march for the Wall; and Daenerys Targaryen--reunited with her dragons--attempts to raise an army in her quest for the Iron Throne.',
    //             episodes: [Array] },
    // ... ] }
})
```