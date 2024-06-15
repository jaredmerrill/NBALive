const main = document.querySelector(".main");
let teamId = localStorage.getItem("teamId");
let teamAbbrev = null;
const team = document.querySelector(".team");
const banner = document.querySelector(".banner");
const bannerTint = document.querySelector(".banner-tint");
const mainLogo = document.querySelector(".main-logo");
const teamName = document.querySelector(".team-name");
const favicon = document.querySelector(".favicon");
const buttons = document.querySelectorAll(".button");
const title = document.querySelector(".title");
const upcomingGames = document.querySelector(".upcoming-games");
const upcomingGamesSection = document.querySelector(".upcoming-games-section");
const roster = document.querySelector(".roster");
const rosterSection = document.querySelector(".roster-section");
let playerFrontDisplays;
let playerBackDisplays;
let slideIndex = 0;
function changeSlide(teamAbbrev) {
    banner.style.backgroundImage = `url("./nbaphotos/${teamAbbrev}/${teamAbbrev}${slideIndex + 1}.jpg")`;
    slideIndex++;
    if (slideIndex > 9) {
        slideIndex = 0;
    }
}

const today = new Date();
function gamesSince(daysback) {
    //returns timestamp of today - x days
    if (daysback >= today.getDate()) {
        return `${today.getFullYear()}-${String(today.getMonth()).padStart(2, "0")}-${String(today.getDate() + 31 - daysback).padStart(2, "0")}`;
    }
    else if (daysback > today.getDate() && today.getMonth() == "0") {
        return `${today.getFullYear() - 1}-${String(today.getMonth() + 12).padStart(2, "0")}-${String(today.getDate() + 31 - daysback).padStart(2, "0")}`;
    }
    else if (-daysback + today.getDate() > 30) {
        return `${today.getFullYear()}-${String(today.getMonth() + 2).padStart(2, "0")}-${String(today.getDate() + Math.abs(daysback) - 30).padStart(2, "0")}`;
    }
    else {
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate() - daysback).padStart(2, "0")}`;
    }
}
//since sportsdata.io has different abbrevs than balldontlie
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
fetch(`https://api.balldontlie.io/v1/teams/${teamId}`,
    {
        headers: {
            Authorization: "4a9cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        }
    })
    .then(response => response.json())
    .then(function ({ data }) {
        console.log(data);
        teamAbbrev = data.abbreviation;
        title.textContent = data.full_name;
        bannerTint.style.backgroundColor = `var(--${teamAbbrev}2)`;
        mainLogo.src = `/logos/logo-${data.abbreviation}.png`;
        favicon.href = `/logos/logo-${data.abbreviation}.png`;
        teamName.textContent = teamAbbrev;
        teamName.style.webkitTextStroke = `5px var(--${teamAbbrev})`;
        changeSlide(teamAbbrev);

        function convertHeight(height) {
            return `${Math.floor(height / 12)}' ${height % 12}"`;
        }
        function digitSeperator(number) {
            let stringNumber = String(number);
            let counter = 0;
            for (let i = stringNumber.length - 1; i >= 0; i--) {
                if (counter % 3 == 2 && counter != 0 && i != 0) {
                    stringNumber = stringNumber.slice(0, i) + "," + stringNumber.slice(i);
                }
                counter++;
            }
            return stringNumber;
        }
        function ordinalOf(number) {
            number = number + 1;
            if (number % 10 == 1 && (number < 10 || number > 20)) {
                return "st";
            }
            else if (number % 10 == 2 && (number < 10 || number > 20)) {
                return "nd";
            }
            else if (number % 10 == 3 && (number < 10 || number > 20)) {
                return "rd";
            }
            else {
                return "th";
            }
        }
        function createPlayerDisplay(player) {
            const id = player.NbaDotComPlayerID;
            console.log(player);
            return id ? `
            <div class="player-display">
                <div class="front-player-display">
                    <div class="player-number">
                        <p>#${player.Jersey}</p>
                    </div>
                    <img class="player-headshot" src="https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png" >
                    <div class="player-name">
                        <p>${player.FirstName} ${player.LastName}</p>
                    </div>
                    <div class="player-details">
                        <p class="player-height">Height: ${convertHeight(player.Height)}</p>
                        <p class="player-weight">Weight: ${player.Weight} lbs</p>
                        
                    </div>
                </div>


                <div class="back-player-display">
                    <div class="player-header">
                        <div class="back-player-name-container">
                            <p class="back-player-name reversed">${player.FirstName}</p>
                            <p class="back-player-name reversed">${player.LastName}</p>
                        </div>
                        <img class="mini-logo reversed" src="/logos/logo-${teamAbbrev}.png">
                        <hr width="90%">
                    </div> 
                    <div class="back-player-details">
                        <p class="player-born reversed">Born:  ${player.BirthCity}, ${player.BirthState ? player.BirthState : player.BirthCountry}</p>
                        <p class="player-college reversed">Graduated: ${player.College}</p>
                        <p class="player-position ${player.Position ? "" : "hidden"} reversed ">Position: ${player.Position}</p>
                        <p class="player-exp reversed">${player.Experience + 1}${ordinalOf(player.Experience)} Year in the NBA</p>   
                        <p class="player-salary ${player.Salary ? "" : "hidden"} reversed">Salary: $${digitSeperator(player.Salary)}</p>
                    </div>
                </div>
            </div>
            ` :
                `
                <div class="player-display">
                    <div class="front-player-display">
                        <div class="player-number">
                            <p>#${player.Jersey}</p>
                        </div>
                        <div class="no-headshot-section">
                            <div class="no-headshot">
                                <p>${player.FirstName[0].toUpperCase()}${player.LastName[0].toUpperCase()}</p>
                            </div>
                            <img class="player-headshot hidden" src="https://cdn.nba.com/headshots/nba/latest/1040x760/1631221.png">
                        </div>
                        <div class="player-name">
                            <p>${player.FirstName} ${player.LastName}</p>
                        </div>
                        <div class="player-details">
                            <p class="player-height">Height: ${convertHeight(player.Height)}</p>
                            <p class="player-weight">Weight: ${player.Weight} lbs</p>
                        </div>
                    </div>


                    <div class="back-player-display">
                        <div class="player-header">
                            <div class="back-player-name-container">
                                <p class="back-player-name reversed">${player.FirstName}</p>
                                <p class="back-player-name reversed">${player.LastName}</p>
                            </div>
                            <img class="mini-logo reversed" src="/logos/logo-${teamAbbrev}.png">
                            <hr width="90%">
                        </div> 
                        <div class="back-player-details">
                            <p class="player-born reversed">Born:  ${player.BirthCity}, ${player.BirthState ? player.BirthState : player.BirthCountry}</p>
                            <p class="player-college reversed">Graduated: ${player.College}</p>
                            <p class="player-position ${player.Position ? "" : "hidden"} reversed ">Position: ${player.Position}</p>
                            <p class="player-exp reversed">${player.Experience + 1}${ordinalOf(player.Experience)} Year in the NBA</p>  
                            <p class="player-salary ${player.Salary ? "" : "hidden"} reversed">Salary: $${digitSeperator(player.Salary)}</p>
                        </div>
                    </div>
                </div>
            `
        }
        //get + display roster
        fetch(`https://api.sportsdata.io/v3/nba/scores/json/Players/${convertTeamAbbrev(teamAbbrev)}?key=c8fbXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                data.forEach(function (player) {
                    roster.insertAdjacentHTML("beforeend", createPlayerDisplay(player));
                })
                playerFrontDisplays = document.querySelectorAll(".front-player-display");
                playerBackDisplays = document.querySelectorAll(".back-player-display");
                roster.addEventListener("click", function (e) {
                    const targetFrontDisplay = e.target.closest(".player-display").querySelector(".front-player-display");
                    const targetBackDisplay = e.target.closest(".player-display").querySelector(".back-player-display");
                    if ([...playerFrontDisplays].includes(targetFrontDisplay)) {
                        if (targetFrontDisplay.style.transform != `perspective(300px) rotateY(180deg)`) {
                            targetFrontDisplay.style.transform = `perspective(300px) rotateY(180deg)`;
                            targetBackDisplay.style.transform = `perspective(300px) rotateY(180deg)`;
                            setTimeout(function () {
                                targetBackDisplay.style.zIndex = "1";
                            }, 40)

                        }
                        else {
                            targetBackDisplay.style.zIndex = "-1";
                            setTimeout(function () {
                                targetFrontDisplay.style.transform = ``;
                                targetBackDisplay.style.transform = ``;
                            }, 60);








                        }
                    }
                })
            })



        //Display Upcoming Games
        function createUpcomingGameDisplay(game) {
            const hour = parseInt(game.status.slice(11, 13));
            let ampm;
            function convertHour(hourParam) {

                hourParam -= 7;
                if (hourParam < 0) {
                    hourParam += 24;
                }

                if (hourParam > 12) {
                    hourParam -= 12;
                    ampm = "PM"
                }
                else {
                    ampm = "AM";
                }

                if (hourParam == 12) {
                    ampm = "PM";
                }
                return hourParam;
            }
            return `<div class="upcoming-game game-display" gameId=${game.id}>
            <div class="game-side game-side-visitor">
                <img class="game-img game-display-visitor-img" src="./logos/logo-${game.visitor_team.abbreviation}.png" teamId="${game.visitor_team.id}">

            </div>
            <div class="game-side game-details">
                <p class="game-status">${game.date.slice(0, 4) == today.getFullYear() && parseInt(game.date.slice(5, 7)) == today.getMonth() + 1 && parseInt(game.date.slice(8)) == today.getDate() ? "Today" : new Date(parseInt(game.date.slice(0, 4)), parseInt(game.date.slice(5, 7)) - 1, parseInt(game.date.slice(8))).toLocaleString("default", { month: "long" }).slice(0, 3) + " " + parseInt(game.date.slice(8))}</p>
                <p class="game-status">${convertHour(hour)}:${game.status.slice(14, 16)} ${ampm}</p>
            </div>
            <div class="game-side game-side-home">
                <img class="game-img game-display-home-img" src="./logos/logo-${game.home_team.abbreviation}.png" teamId="${game.home_team.id}">
            </div>
        </div>
        `
        }
        fetch(`https://api.balldontlie.io/v1/games/?start_date=${gamesSince(0)}&team_ids[]=${data.id}&per_page=100`, {
            headers: {
                Authorization: "4a9cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                //Remove non-upcoming games
                for (let i = data.data.length - 1; i >= 0; i--) {
                    if (data.data[i].time) {
                        data.data.splice(i, 1);
                    }
                }
                //Add games to section
                console.log(data);

                for (let i = 0; i < data.data.length; i++) {
                    if (!data.data[i].time && i < 8) {
                        upcomingGames.insertAdjacentHTML("beforebegin", createUpcomingGameDisplay(data.data[i]));
                    }
                }
                if (data.data.length == 0) {
                    upcomingGames.insertAdjacentHTML("beforebegin", `<div class="no-games">No Upcoming Games</div>`);
                }
                //Add clickable functionality
                const gameImg = document.querySelectorAll(".game-img");
                upcomingGamesSection.addEventListener("click", function (e) {
                    if ([...gameImg].includes(e.target)) {
                        teamId = e.target.getAttribute("teamId");
                        localStorage.setItem("teamId", teamId);
                        window.location = "teamstat.html";
                        console.log(e.target);
                    }

                })


            })



    });


setInterval(() => changeSlide(teamAbbrev), 4000);

buttons.forEach(function (el) {
    el.addEventListener("click", function () {
        window.location = "index.html";
    })
})
console.log(teamId);
