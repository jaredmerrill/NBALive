const gameId = localStorage.getItem("gameId");
const gameUrl = `https://api.balldontlie.io/v1/games/${gameId}`;
const gameUrlStats = `https://api.balldontlie.io/v1/stats/?game_ids[]=${gameId}&per_page=100`;
const buttons = document.querySelectorAll(".button");
const main = document.querySelector(".main");
const gameStats = document.querySelector(".game-stats");
const game = null;
const title = document.querySelector("title");
let gameDate = null;
let visitorTeam = null;
let homeTeam = null;
function convertTeamAbbrev(abbrev) {
    if (abbrev == "GSW") {
        return "GS";
    }
    else if (abbrev == "NYK") {
        return "NY";
    }
    else if (abbrev == "PHX") {
        return "PHO";
    }
    else if (abbrev == "NOP") {
        return "NO";
    }
    else if (abbrev == "SAS") {
        return "SA";
    }
    else {
        return abbrev;
    }
}
function getPlayerID(name) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.sportsdata.io/v3/nba/scores/json/Players?key=c8fb612145514e34a73bb87b7edcdc37`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                data.forEach(function (el) {
                    if (el.FirstName + " " + el.LastName == name) {
                        resolve(el.NbaDotComPlayerID);
                    }
                })
                reject(new Error());
            })
    });
}
function addPlayer(player, id, out) {
    return id && !out ? `
        <div class="player-row">
            
            <div class="player-row-main">
                <img class="player-headshot" src="https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png">
                <div class="player-name">
                    <p>${player.player.first_name} ${player.player.last_name}</p>
                </div>
            </div>
            <div class="player-stats">
                <p class="player-row-points">${player.pts}</p>
                <p class="player-row-assists">${player.ast}</p>
                <p class="player-row-rebounds">${player.reb}</p>
                <p class="player-row-blocks">${player.blk}</p>
                <p class="player-row-steals">${player.stl}</p>
                <p class="player-row-fg">${player.fgm + "/" + player.fga}</p>
                <p class="player-row-3s">${player.fg3m + "/" + player.fg3a}</p>
                <p class="player-row-ft">${player.ftm + "/" + player.fta}</p>
                <p class="player-row-turnovers">${player.turnover}</p>
                <p class="player-row-minutes">${player.min[0] == "0" ? player.min[1] : player.min}</p>
            </div>
        </div>
        <hr>
    ` :
        (!out ? `
        <div class="player-row">
            
            <div class="player-row-main">
                <div class="no-headshot">
                    <p>${player.player.first_name[0].toUpperCase()}${player.player.last_name[0].toUpperCase()}</p>
                </div>
                <div class="player-name">
                    <p>${player.player.first_name} ${player.player.last_name}</p>
                </div>
            </div>
            <div class="player-stats">
                <p class="player-row-points">${player.pts}</p>
                <p class="player-row-assists">${player.ast}</p>
                <p class="player-row-rebounds">${player.reb}</p>
                <p class="player-row-blocks">${player.blk}</p>
                <p class="player-row-steals">${player.stl}</p>
                <p class="player-row-fg">${player.fgm + "/" + player.fga}</p>
                <p class="player-row-3s">${player.fg3m + "/" + player.fg3a}</p>
                <p class="player-row-ft">${player.ftm + "/" + player.fta}</p>
                <p class="player-row-turnovers">${player.turnover}</p>
                <p class="player-row-minutes">${player.min[0] == "0" ? player.min[1] : player.min}</p>
            </div>
        </div>
        <hr>
    ` :
            `

    `)


}


buttons.forEach(function (el) {
    el.addEventListener("click", function () {
        window.location = "index.html";
    })
})
fetch(gameUrl,
    {
        headers: {
            Authorization: "4a9ce398-c1f0-45a3-ae08-4fee03f2a41d"
        },
    })
    .then(function (response) {
        return response.json();
    })
    .then(function ({ data }) {
        visitorTeam = data.visitor_team;
        homeTeam = data.home_team;
        const winningTeam = data.visitor_team_score > data.home_team_score ? visitorTeam : homeTeam;
        title.textContent = `${visitorTeam.abbreviation} vs. ${homeTeam.abbreviation}`;
        let visitorTeamPlayers = [];
        let homeTeamPlayers = [];
        gameDate = data.date;
        function updateStats(team) {
            gameStats.innerHTML = "";
            gameStats.insertAdjacentHTML("beforeend",
                `
                        <div class="stats-key-row">
                            <div class="key-name">
                                <p>Photo</p>
                                <p>Name</p>
                            </div>
                            <div class="key-stats">
                                <p>Points</p>
                                <p>Assists</p>
                                <p>Rebounds</p>
                                <p>Blocks</p>
                                <p>Steals</p>
                                <p>FG%</p>
                                <p>3 Point %</p>
                                <p>FT%</p>
                                <p>Turnovers</p>
                                <p>Minutes</p>
                            </div>
                        </div>
                        <hr>
                    `);

            team.forEach(function (el) {
                getPlayerID(el.player.first_name + " " + el.player.last_name)
                    .then(function (id) {
                        gameStats.insertAdjacentHTML("beforeend", addPlayer(el, id, el.min == "00" ? true : false));
                    })
                    .catch(function () {
                        console.log("no picture for " + el.player.first_name);
                    })
            })


        }
        fetch(gameUrlStats,
            {
                headers: {
                    Authorization: "4a9ce398-c1f0-45a3-ae08-4fee03f2a41d"
                },
            }
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                data.data.forEach(function (el) {
                    if (el.team.abbreviation == visitorTeam.abbreviation) {
                        visitorTeamPlayers.push(el);
                    }
                    else if (el.team.abbreviation == homeTeam.abbreviation) {
                        homeTeamPlayers.push(el);
                    }
                })
                updateStats(winningTeam.id == visitorTeam.id ? visitorTeamPlayers : homeTeamPlayers);
            });
        function createBanner() {
            return data?.time == "Final" || !data ? `
            <div class="banner">
                <div class="game-team game-side game-side-visitor ${data.visitor_team_score > data.home_team_score ? "selected" : ""}">
                    <p class="game-side-text team-name game-side-team-name-visitor">${visitorTeam.name.toUpperCase()}</p>
                    <img class="game-img game-side-visitor-img" src="./logos/logo-${visitorTeam.abbreviation}.png" teamId="${visitorTeam.id}">
                    <p class="game-side-text game-score">${data.visitor_team_score}</p>
                </div>

                <div class="game-side game-side-text vs">VS</div>

                <div class="game-team game-side game-side-home ${data.home_team_score > data.visitor_team_score ? "selected" : ""}">
                    <p class="game-side-text team-name game-side-team-name-home">${homeTeam.name.toUpperCase()}</p>
                    <img class="game-img game-side-home-img" src="./logos/logo-${homeTeam.abbreviation}.png" teamId="${homeTeam.id}">
                    <p class="game-side-text game-score">${data.home_team_score}</p>
                </div>
            </div>
        ` :
                `
        <div class="banner">
                <div class="game-team game-side game-side-visitor ${data.visitor_team_score > data.home_team_score ? "selected" : ""}">
                    <p class="game-side-text team-name game-side-team-name-visitor">${visitorTeam.name.toUpperCase()}</p>
                    <img class="game-img game-side-visitor-img" src="./logos/logo-${visitorTeam.abbreviation}.png" teamId="${visitorTeam.id}">
                    <p class="game-side-text game-score">${data.visitor_team_score}</p>
                </div>
                <div class="game-side game-middle">
                <p class="game-side-text vs">VS</p>
                <p class="live-box">LIVE</p>
                </div>
                
                <div class="game-team game-side game-side-home ${data.home_team_score > data.visitor_team_score ? "selected" : ""}">
                    <p class="game-side-text team-name game-side-team-name-home">${homeTeam.name.toUpperCase()}</p>
                    <img class="game-img game-side-home-img" src="./logos/logo-${homeTeam.abbreviation}.png" teamId="${homeTeam.id}">
                    <p class="game-side-text game-score">${data.home_team_score}</p>
                </div>
            </div>
        `

        }
        main.insertAdjacentHTML("afterbegin", createBanner());

        const banner = document.querySelector(".banner");
        const gameImg = document.querySelectorAll(".game-img");
        const gameTeam = document.querySelectorAll(".game-team");
        banner.style.backgroundImage = `linear-gradient(to right, var(--${visitorTeam.abbreviation}) , var(--${homeTeam.abbreviation}))`;

        function checkIfTeamArea(e) {
            if ([...gameTeam].includes(e.target.closest(".game-team")) && ![...gameImg].includes(e.target)) {
                return true;
            }
            return false;
        }
        banner.addEventListener("click", function (e) {
            if (checkIfTeamArea(e) && !e.target.closest(".game-team").classList.contains("selected")) { //Team area clicked, but not team icon clicked
                gameTeam.forEach(function (el) {
                    el.classList.remove("selected");
                })
                const selectedTeam = e.target.closest(".game-team");
                selectedTeam.classList.add("selected");
                selectedTeam.classList.remove("hover-selected");
                if (selectedTeam.querySelector(".game-img").getAttribute("teamid") == visitorTeam.id) {
                    updateStats(visitorTeamPlayers);
                }
                else if (selectedTeam.querySelector(".game-img").getAttribute("teamid") == homeTeam.id) {
                    updateStats(homeTeamPlayers);
                }
            }
            else if ([...gameImg].includes(e.target)) { //Team icon clicked
                const teamId = e.target.getAttribute("teamId");
                localStorage.setItem("teamId", teamId);
                window.location = "teamstat.html";
            }
        })
        banner.addEventListener("mouseover", function (e) {
            if ([...gameTeam].includes(e.target.closest(".game-team")) && !e.target.closest(".game-team").classList.contains("selected")) { //Team area hovered, but not team icon hovered
                e.target.closest(".game-team").classList.add("hover-selected");
            }
        })
        banner.addEventListener("mouseout", function (e) {
            e.target.closest(".game-team")?.classList.remove("hover-selected");

        })


        fetch(`https://api.sportsdata.io/v3/nba/scores/json/GamesByDate/${gameDate}?key=c8fb612145514e34a73bb87b7edcdc37`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let gameDetails = null;

                data.forEach(function (el) {
                    if (el.HomeTeam == convertTeamAbbrev(homeTeam.abbreviation)) {
                        gameDetails = el;
                        console.log(gameDetails);
                    }
                })
            })
        fetch(`https://api.sportsdata.io/v3/nba/scores/json/GamesByDate/${gameDate}?key=c8fb612145514e34a73bb87b7edcdc37`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            })
    })
