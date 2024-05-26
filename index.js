const today = new Date();



function gamesSince(daysback) {
    //returns YYYY-MM-DD of today - daysback # of days

    let newDay = new Date().setDate(today.getDate() - daysback);
    newDay = new Date(newDay);
    return `${today.getFullYear()}-${String(newDay.getMonth() + 1).padStart(2, "0")}-${String(newDay.getDate()).padStart(2, "0")}`;
}
const recentGames = `https://api.balldontlie.io/v1/games/?start_date=${gamesSince(7)}&end_date=${gamesSince(-4)}&per_page=100`;
const teams = `https://api.balldontlie.io/v1/teams`;

//Queries
const everywhere = document.querySelector("body");
const games = document.querySelector(".games");
const nav = document.querySelector(".nav");
const activeGameDate = document.querySelector(".active-game-date");
const gameDateContents = document.querySelector(".game-date-contents");
const gameDates = document.querySelectorAll(".date-contents");
const gameDateInput = document.querySelector(".date-contents-input");
const activeTeam = document.querySelector(".active-team");
const allTeamContents = document.querySelector(".all-team-contents");
const teamContents = document.querySelectorAll(".team-contents");
const errorBox = document.querySelector(".error-box");
let dayDividerImg = null;
//Dropdown functionality
let date = activeGameDate.textContent.slice(0, activeGameDate.textContent.length - 2).slice(2);
let team = null;

//Show Dropdowns
activeGameDate.addEventListener("click", function () {
    if (gameDateContents.style.display == "none") {
        gameDateContents.style.display = "block";
        activeGameDate.querySelector(".arrow").textContent = "▲";
    }
    else {
        gameDateContents.style.display = "none";
        activeGameDate.querySelector(".arrow").textContent = "▼";
        gameDateInput.value = "";
    }
})
gameDates.forEach(function (element) {
    element.addEventListener("click", function () {
        activeGameDate.innerHTML = `⠀⠀${element.textContent}⠀<span class="arrow">▼</span>`;
        activeGameDate.classList.remove("input");
        gameDateContents.style.display = "none";
        date = activeGameDate.textContent.slice(0, activeGameDate.textContent.length - 2).slice(2);
        refreshGames();
    })
})



activeTeam.addEventListener("click", function () {
    if (allTeamContents.style.display == "none") {
        allTeamContents.style.display = "block";
        activeTeam.querySelector(".arrow").textContent = "▲";
    }
    else {
        allTeamContents.style.display = "none";
        activeTeam.querySelector(".arrow").textContent = "▼";
    }
})
allTeamContents.addEventListener("click", function (e) {
    if (e.target.getAttribute("src")) {
        activeTeam.innerHTML = `⠀Team: ${e.target.getAttribute("src").slice(13, 16)}⠀<span class="arrow">▼</span>`;
        allTeamContents.style.display = "none";
        team = activeTeam.textContent.slice(7, 10);
        refreshGames();
    }
    else if (e.target.classList.contains("all-teams-content")) {
        activeTeam.innerHTML = `⠀All Teams⠀<span class="arrow">▼</span>`;
        allTeamContents.style.display = "none";
        team = null;
        refreshGames();
    }

})


//Custom Date Input Handling
gameDateInput.addEventListener("keydown", function (e) {
    let [year, month, day] = gameDateInput.value.split("-");
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    function inputErrorMessage(message) {
        errorBox.textContent = message;
        errorBox.style.transform = `translateY(150%)`;
        setTimeout(function () {
            errorBox.style.transform = `translateY(-15%)`;
        }, 1300);
    }
    function inputFindGames() {
        gameDateContents.style.display = "none";
        activeGameDate.innerHTML = `⠀⠀${gameDateInput.value}⠀<span class="arrow">▼</span>`;
        activeGameDate.classList.add("input");
        gameDateInput.value = "";
        date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        refreshGames();
    }

    if (e.key == "Enter") {
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
            inputErrorMessage("Invalid Date");

        }
        else if (!(year > 0) || !(String(year).length == 4) || !(month >= 1 && month <= 12) || !(day >= 1 && day <= 31)) {
            inputErrorMessage("Invalid Date");
        }
        else if (month > 6) {
            if (year == today.getFullYear() - 1 && month > 9) {
                inputFindGames();
            }
            else if (year != today.getFullYear()) {
                inputErrorMessage("Current Season Only");
            }
            else if (year == today.getFullYear()) {
                inputErrorMessage("Current Season Only");
            }
            else {
                inputFindGames();
            }
        }
        else {
            if (year == today.getFullYear() - 1 && month > 9) {
                inputFindGames();
            }
            else if (year != today.getFullYear()) {
                inputErrorMessage("Current Season Only");
            }
            else {
                inputFindGames();
            }
        }
    }
})



everywhere.addEventListener("click", function (e) {
    if (e.target.closest(".nav") != nav) {
        gameDateContents.style.display = "none";
        allTeamContents.style.display = "none";
        activeGameDate.querySelector(".arrow").textContent = "▼";
        activeTeam.querySelector(".arrow").textContent = "▼";
    }
})


let gameDisplay = null;
let gameSide = null;
let gameImg = null;
let gameId = null;
let teamId = null;
let gamesArr = [];
let upcomingGamesArr = [];
function refreshGames() {
    games.innerHTML = "";
    gamesArr = [];
    upcomingGamesArr = [];
    fetch(recentGames,
        {
            headers: {
                Authorization: "4a9ce398-c1f0-45a3-ae08-4fee03f2a41d"
            },
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            function teamInGame(game, team) {
                if (game.home_team.abbreviation == team || game.visitor_team.abbreviation == team) {
                    return true;
                }
                else {
                    return false;
                }

            }
            //Mapping games to either upcoming games array, or past games array
            data.data.forEach(function (game) {
                if (game.time) {
                    gamesArr.push(game);
                }
                else {
                    upcomingGamesArr.unshift(game);
                }
            })

            function createGameDisplay(game) {
                return `
                <div class="game-display" gameId=${game.id}>
                    <div class="game-side game-side-visitor ${game.visitor_team_score > game.home_team_score && game.time == "Final" ? "winner" : ""}">
                        <img class="game-img game-display-visitor-img" src="./logos/logo-${game.visitor_team.abbreviation}.png" teamId="${game.visitor_team.id}">
                        <p class="game-score game-display-visitor-score">${game.visitor_team_score}</p>
                    
                    </div>
                    <div class="game-side game-details">
                        <p class="game-status">${game.time == "Final" && game.period > 4 ? `${game.time.toUpperCase()}/OT` : game.time.toUpperCase()}</p>
                        <div class="live-date-section">
                            <p class="${game.time != "Final" && game.time ? "live-box" : "live-box hidden"}">LIVE</p>
                            <p class="${game.time != "Final" ? "final-game-time hidden" : "final-game-time"}">${game.date.slice(0, 4) == today.getFullYear() && parseInt(game.date.slice(5, 7)) == today.getMonth() + 1 && parseInt(game.date.slice(8)) == today.getDate() ? "Today" : new Date(parseInt(game.date.slice(0, 4)), parseInt(game.date.slice(5, 7)) - 1, parseInt(game.date.slice(8))).toLocaleString("default", { month: "long" }).slice(0, 3) + " " + parseInt(game.date.slice(8))}</p>
                        </div>
                    </div>
                    <div class="game-side game-side-home ${game.home_team_score > game.visitor_team_score && game.time == "Final" ? "winner" : ""}">
                        <img class="game-img game-display-home-img" src="./logos/logo-${game.home_team.abbreviation}.png" teamId="${game.home_team.id}">
                        <p class="game-score game-score-home">${game.home_team_score}</p>
                    </div>
                </div>`


            }
            function createUpcomingGameDisplay(game) {
                const hour = parseInt(game.status.slice(11, 13));
                let ampm;
                function convertHour(hourParam) {
                    hourParam -= today.getTimezoneOffset() / 60;
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
                    <p class="game-status game-time">${convertHour(hour)}:${game.status.slice(14, 16)} ${ampm}</p>
                </div>
                <div class="game-side game-side-home">
                    <img class="game-img game-display-home-img" src="./logos/logo-${game.home_team.abbreviation}.png" teamId="${game.home_team.id}">
                </div>
            </div>
            `
            }
            if (date == "Today") {
                for (let i = gamesArr.length - 1; i >= 0; i--) {
                    const game = gamesArr[i];
                    if (game.date != gamesSince(0)) {
                        gamesArr.splice(i, 1);
                    }

                }
                //Make sure live games always appear at end of gamesArr
                if (gamesArr.length) {
                    let livegames = [];
                    let nonlivegames = [];
                    gamesArr.forEach(function (game) {
                        if (game.status != "Final") {
                            livegames.push(game);
                        }
                        else {
                            nonlivegames.push(game);
                        }
                    })
                    gamesArr = nonlivegames.concat(livegames);
                }


            }
            else if (date == "Past 3 Days") {
                for (let i = gamesArr.length - 1; i >= 0; i--) {
                    const game = gamesArr[i];
                    if (game.date != gamesSince(3) && game.date != gamesSince(2) && game.date != gamesSince(1)) {
                        gamesArr.splice(i, 1);
                    }
                }
            }
            else if (date == "Past Week") {
                for (let i = gamesArr.length - 1; i >= 0; i--) {
                    const game = gamesArr[i];
                    if (game.date != gamesSince(7) && game.date != gamesSince(6) && game.date != gamesSince(5) && game.date != gamesSince(4) && game.date != gamesSince(3) && game.date != gamesSince(2) && game.date != gamesSince(1)) {
                        gamesArr.splice(i, 1);
                    }
                }
            }
            //Specific Date Input
            else if (date != "Upcoming") {
                fetch(`https://api.balldontlie.io/v1/games/?dates[]=${date}`, {
                    headers: {
                        Authorization: "4a9ce398-c1f0-45a3-ae08-4fee03f2a41d",
                    },
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        let numberOfGamesDisplayed = 0;
                        if (team) {
                            data.data.forEach(function (el) {
                                if (el.time && teamInGame(el, team)) {
                                    games.insertAdjacentHTML("afterbegin", createGameDisplay(el));
                                    numberOfGamesDisplayed++;
                                }
                                else if (teamInGame(el, team)) {
                                    games.insertAdjacentHTML("afterbegin", createUpcomingGameDisplay(el));
                                    numberOfGamesDisplayed++;
                                }
                            })
                        }
                        else {
                            data.data.forEach(function (el) {
                                if (el.time) {
                                    games.insertAdjacentHTML("afterbegin", createGameDisplay(el));
                                    numberOfGamesDisplayed++;
                                }
                                else {
                                    games.insertAdjacentHTML("afterbegin", createUpcomingGameDisplay(el));
                                    numberOfGamesDisplayed++;
                                }
                            })
                        }
                        const inputDate = new Date(date);
                        inputDate.setDate(inputDate.getDate() + 1);
                        games.insertAdjacentHTML("afterbegin", createDayDividerByDate(inputDate));
                        gameDisplay = document.querySelectorAll(".game-display");
                        gameSide = document.querySelectorAll(".game-side");
                        gameImg = document.querySelectorAll(".game-img");
                        games.addEventListener("click", function (e) {
                            if ([...gameDisplay].includes(e.target.closest(".game-display")) && ![...gameImg].includes(e.target) && !e.target.closest(".game-display").classList.contains("upcoming-game")) { //If click is inside game display AND not on a game icon (Event delegation)
                                gameId = e.target.closest(".game-display").getAttribute("gameId");
                                localStorage.setItem("gameId", gameId);
                                window.location = "gamestat.html";

                            }
                            else if ([...gameImg].includes(e.target)) {
                                teamId = e.target.getAttribute("teamId");
                                localStorage.setItem("teamId", teamId);
                                window.location = "teamstat.html";
                            }
                        })
                        const gameDisplays2 = document.querySelectorAll(".game-display");
                        [...gameDisplays2].forEach(function (el) {
                            el.addEventListener("mouseover", function () {
                                if (!el.classList.contains("upcoming-game")) {
                                    el.style.backgroundColor = "rgb(168, 168, 168)";
                                }
                            })
                            el.addEventListener("mouseout", function () {
                                el.style.backgroundColor = "rgb(198, 198, 198)";
                            })
                        })

                        if (numberOfGamesDisplayed == 0) {
                            games.insertAdjacentHTML("beforeend",
                                `<div class="no-games">No Games</div>`
                            )
                        }



                    })

            }
            function createDayDivider(game, team) {
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                let date = new Date(game.date);
                date = new Date(date.setDate(date.getDate() + 1));
                if (!team) {
                    return date.getFullYear() == today.getFullYear() ? `
                 <div class="day-divider">
                 ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDate()}
                 <hr>
                 </div>
                `
                        :
                        `
                <div class="day-divider">
                ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDay()} , ${date.getFullYear()}
                <hr>
                 </div>
                `
                }
                else {
                    return date.getFullYear() == today.getFullYear() ? `
                 <div class="day-divider">
                 ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDate()}
                 <img class="day-divider-img" src="./logos/logo-${team}.png">
                 <hr>
                 </div>
                `
                        :
                        `
                <div class="day-divider">
                ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDay()} , ${date.getFullYear()}
                <hr>
                 </div>
                `
                }

            }
            function createDayDividerByDate(date, team) {
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
                if (!team) {
                    return date.getFullYear() == today.getFullYear() ? `
                 <div class="day-divider">
                 ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDate()}
                 <hr>
                 </div>
                `
                        :
                        `
                <div class="day-divider">
                ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDate()} , ${date.getFullYear()}
                <hr>
                 </div>
                `
                }
                else {
                    return date.getFullYear() == today.getFullYear() ? `
                 <div class="day-divider">
                 ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDate()}
                 <img class="day-divider-img" src="./logos/logo-${team}.png" teamAbbrev="${team}">
                 <hr>
                 </div>
                `
                        :
                        `
                <div class="day-divider">
                ${days[date.getDay()]}, ${date.toLocaleString("default", { month: "long" })} ${date.getDay()} , ${date.getFullYear()}
                <hr>
                <img class="day-divider-img" src="./logos/logo-${team}.png" teamAbbrev="${team}">
                 </div>
                `
                }


            }
            function isDifferentDay(game1, game2) {
                return game1.date != game2.date;
            }
            if (team) {
                console.log(team);
                if (date == "Upcoming") {
                    for (let i = upcomingGamesArr.length - 1; i >= 0; i--) {
                        const game = upcomingGamesArr[i];
                        if (!teamInGame(upcomingGamesArr[i], team)) {
                            upcomingGamesArr.splice(i, 1);
                        }
                    }
                    console.log(upcomingGamesArr);
                    for (let i = 0; i < upcomingGamesArr.length; i++) {
                        if (i != 0 && isDifferentDay(upcomingGamesArr[i], upcomingGamesArr[i - 1])) {
                            games.insertAdjacentHTML("afterbegin", createDayDivider(upcomingGamesArr[i - 1]));
                            dayDividerImg = document.querySelectorAll(".day-divider-img");
                        }
                        games.insertAdjacentHTML("afterbegin", createUpcomingGameDisplay(upcomingGamesArr[i]));
                    }
                    if (upcomingGamesArr.length != 0) {
                        games.insertAdjacentHTML("afterbegin", createDayDivider(upcomingGamesArr[upcomingGamesArr.length - 1], team));
                    }
                    else {
                        games.insertAdjacentHTML("afterbegin", createDayDividerByDate(new Date(), team));
                        games.insertAdjacentHTML("beforeend", `<div class="no-games">No Games</div>`);
                    }
                    dayDividerImg = document.querySelectorAll(".day-divider-img");
                }
                else if (!activeGameDate.classList.contains("input")) {
                    for (let i = gamesArr.length - 1; i >= 0; i--) {
                        const game = gamesArr[i];
                        if (!teamInGame(gamesArr[i], team)) {
                            gamesArr.splice(i, 1);
                        }
                    }
                    for (let i = 0; i < gamesArr.length; i++) {
                        if (i != 0 && isDifferentDay(gamesArr[i], gamesArr[i - 1])) {
                            games.insertAdjacentHTML("afterbegin", createDayDivider(gamesArr[i - 1], team));
                            dayDividerImg = document.querySelectorAll(".day-divider-img");
                        }
                        games.insertAdjacentHTML("afterbegin", createGameDisplay(gamesArr[i]));

                    }
                    if (date != "Today" && gamesArr.length != 0) {
                        games.insertAdjacentHTML("afterbegin", createDayDivider(gamesArr[gamesArr.length - 1], team));
                        dayDividerImg = document.querySelectorAll(".day-divider-img");
                    }
                    else {
                        tempToday = new Date();
                        games.insertAdjacentHTML("afterbegin", createDayDividerByDate(tempToday, team));
                        dayDividerImg = document.querySelectorAll(".day-divider-img");
                    }


                }
            }
            else if (!activeGameDate.classList.contains("input")) {
                if (date == "Upcoming") {
                    for (let i = 0; i < upcomingGamesArr.length; i++) {

                        if (i != 0 && isDifferentDay(upcomingGamesArr[i], upcomingGamesArr[i - 1])) {
                            games.insertAdjacentHTML("afterbegin", createDayDivider(upcomingGamesArr[i - 1]));
                        }
                        games.insertAdjacentHTML("afterbegin", createUpcomingGameDisplay(upcomingGamesArr[i]));
                        if (i == upcomingGamesArr.length - 1) {
                            games.insertAdjacentHTML("afterbegin", createDayDivider(upcomingGamesArr[i]));
                        }


                    }
                }
                else {
                    let numberOfGamesDisplayed = 0;
                    const tempToday = new Date();
                    for (let i = 0; i < gamesArr.length; i++) {

                        //Check to see if game is first on a different day
                        if (i != 0 && isDifferentDay(gamesArr[i], gamesArr[i - 1])) {
                            games.insertAdjacentHTML("afterbegin", createDayDivider(gamesArr[i - 1]));
                        }

                        if (gamesArr[i].time) {
                            games.insertAdjacentHTML("afterbegin", createGameDisplay(gamesArr[i]));
                            numberOfGamesDisplayed++;
                        }

                        if (i == gamesArr.length - 1) {
                            games.insertAdjacentHTML("afterbegin", createDayDivider(gamesArr[i]));

                        }

                    }
                    if (numberOfGamesDisplayed == 0 && date == "Today") {
                        games.insertAdjacentHTML("afterbegin", createDayDividerByDate(tempToday));
                    }
                }
            }




            gameDisplay = document.querySelectorAll(".game-display");
            gameSide = document.querySelectorAll(".game-side");
            gameImg = document.querySelectorAll(".game-img");
            const winners = document.querySelectorAll(".winner");
            const gameDisplays = document.querySelectorAll(".game-display");
            [...gameDisplays].forEach(function (el) {
                el.addEventListener("mouseover", function () {
                    if (!el.classList.contains("upcoming-game")) {
                        el.style.backgroundColor = "rgb(168, 168, 168)";
                    }
                    [...el.children].forEach(function (el2) {
                        if ([...winners].includes(el2)) {
                            el2.style.backgroundColor = "rgb(199, 199, 199)";
                        }
                    })
                })
                el.addEventListener("mouseout", function () {
                    el.style.backgroundColor = "rgb(198, 198, 198)";
                    [...el.children].forEach(function (el2) {
                        if ([...winners].includes(el2)) {
                            el2.style.backgroundColor = "rgb(219, 219, 219)";
                        }
                    })
                })
            })


            if (gamesArr.length == 0) {
                games.insertAdjacentHTML("beforeend",
                    `<div class="no-games">No Games</div>`
                )
            }

            games.addEventListener("click", function (e) {
                if ([...gameDisplay].includes(e.target.closest(".game-display")) && ![...gameImg].includes(e.target) && !e.target.closest(".game-display").classList.contains("upcoming-game")) { //If click is inside game display AND not on a game icon (Event delegation)
                    gameId = e.target.closest(".game-display").getAttribute("gameId");
                    localStorage.setItem("gameId", gameId);
                    window.location = "gamestat.html";

                }
                else if ([...gameImg].includes(e.target)) {
                    teamId = e.target.getAttribute("teamId");
                    localStorage.setItem("teamId", teamId);
                    window.location = "teamstat.html";
                }
                else {
                    return;
                }
            })

            dayDividerImg?.forEach(function (el) {
                el.addEventListener("click", function (e) {
                    fetch(`https://api.balldontlie.io/v1/teams`, {
                        headers:
                        {
                            Authorization: "4a9ce398-c1f0-45a3-ae08-4fee03f2a41d"
                        }
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            data.data.forEach(function (el2) {
                                if (el2.abbreviation == el.getAttribute("teamAbbrev")) {
                                    teamId = el2.id;
                                    localStorage.setItem("teamId", teamId);
                                    window.location = "teamstat.html";
                                }
                            })
                        })


                })
            })


        })
}
refreshGames();
let teamsArr = [];
fetch(teams, {
    headers:
    {
        Authorization: "4a9ce398-c1f0-45a3-ae08-4fee03f2a41d"
    }
})
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        data.data.forEach(function (el) {
            teamsArr.push(el);
        })
    })

fetch(`https://api.balldontlie.io/v1/games?start_date=2023-10-01&per_page=50`, {
    headers:
    {
        Authorization: "4a9ce398-c1f0-45a3-ae08-4fee03f2a41d"
    }
})
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })