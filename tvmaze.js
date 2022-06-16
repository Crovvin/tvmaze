const $showsList = $("#shows-list");
const $searchForm = $("#search-form");
const subImage = "http://tinyurl.com/missing-tv";

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(event) {
  let index = $(event.target).closest(".Show").data("show-id");
  let episodes = await getEpisodesOfShow(index);
  populateEpisodes(episodes);
});

async function getShowsByTerm(term) {
  let request = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  let showInfo = request.data.map(response => {
    let show = response.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : subImage
    };
  });
  return showInfo;
}

function populateShows(showInfo) {
  $showsList.empty();
  for (let show of showInfo) {
    let $hud = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>  
       </div>
      `);
    $showsList.append($hud);
  }
}

 $("#search-form").on("submit", async function handleSearch(event) {
  event.preventDefault();
  let search = $("#search-query").val();
  if (!search) return;
  $("#episodes-area").hide();
  let showName = await getShowsByTerm(search);
  populateShows(showName);
});

async function getEpisodesOfShow(id) {
  let request = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let response = request.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
  return response;
}

function populateEpisodes(episodes) { 
  let $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $episodeLines = $(
      `<li>
         ${episode.name}
         (Season ${episode.season}: Episode ${episode.number})
       </li>
      `);
    $episodesList.append($episodeLines);
  }
  $("#episodes-area").show();
}