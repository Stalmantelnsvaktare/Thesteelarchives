/* ==========================================================
   STEEL ARCHIVES
   script.js
========================================================== */


/* ==========================================================
   ELEMENT
========================================================== */

const integrityElement =
    document.getElementById("integrity");

const countdownElement =
    document.getElementById("countdown");

const missionsGrid =
    document.getElementById("missionsGrid");

const archiveLog =
    document.getElementById("archiveLog");


/* ==========================================================
   SETTINGS
========================================================== */

const missionFile =
    "data/missions.json";

let missions = [];


/* ==========================================================
   INIT
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadMissions();

    }

);


/* ==========================================================
   LOAD MISSIONS
========================================================== */

async function loadMissions(){

    try{

        const response =
            await fetch(missionFile);

        missions =
            await response.json();

        renderMissions();

        updateIntegrity();

        updateCountdown();

        setInterval(

            updateCountdown,

            1000

        );

    }

    catch(error){

        console.error(error);

    }

}


/* ==========================================================
   RENDER MISSIONS
========================================================== */

function renderMissions(){

    missionsGrid.innerHTML = "";

    missions.forEach(

        mission => {

            const card =
                createMissionCard(mission);

            missionsGrid.appendChild(card);

        }

    );

}


/* ==========================================================
   CREATE CARD
========================================================== */

function createMissionCard(mission){

    const card =
        document.createElement("div");

    card.className =
        "mission-card";

    if(mission.completed){

        card.classList.add("completed");

    }

    else if(mission.unlocked){

        card.classList.add("unlocked");

    }

    else{

        card.classList.add("locked");

    }

    card.innerHTML = `

        <h3 class="mission-title">

            ${mission.title}

        </h3>

        <p class="mission-status">

            ${mission.status}

        </p>

    `;

    if(mission.unlocked){

        const button =
            document.createElement("a");

        button.href =
            mission.page;

        button.className =
            "mission-button";

        button.textContent =
            "Öppna";

        card.appendChild(button);

    }

    return card;/* ==========================================================
   UPDATE INTEGRITY
========================================================== */

function updateIntegrity(){

    if(missions.length === 0){

        integrityElement.textContent = "100%";

        return;

    }

    const completed =
        missions.filter(

            mission => mission.completed

        ).length;

    const total =
        missions.length;

    const percentage =
        Math.round(

            100 -

            ((completed / total) * 100)

        );

    integrityElement.textContent =
        percentage + "%";

}


/* ==========================================================
   COUNTDOWN
========================================================== */

function updateCountdown(){

    const nextMission =
        missions.find(

            mission => !mission.unlocked

        );

    if(!nextMission){

        countdownElement.textContent =
            "Alla förseglingar brutna";

        return;

    }

    const now =
        new Date();

    const unlock =
        new Date(nextMission.unlockDate);

    const diff =
        unlock - now;

    if(diff <= 0){

        nextMission.unlocked = true;

        renderMissions();

        updateIntegrity();

        return;

    }

    const days =
        Math.floor(diff / 86400000);

    const hours =
        Math.floor(

            (diff % 86400000)

            / 3600000

        );

    const minutes =
        Math.floor(

            (diff % 3600000)

            / 60000

        );

    const seconds =
        Math.floor(

            (diff % 60000)

            / 1000

        );

    countdownElement.textContent =

        `${days} d  ${hours} h  ${minutes} m  ${seconds} s`;

}


/* ==========================================================
   ARCHIVE LOG
========================================================== */

function addLog(

    text,

    date = new Date()

){

    const entry =
        document.createElement("div");

    entry.className =
        "log-entry fade-in";

    entry.innerHTML = `

        <div class="log-date">

            ${formatDate(date)}

        </div>

        <div class="log-text">

            ${text}

        </div>

    `;

    archiveLog.prepend(entry);

}


/* ==========================================================
   DATE FORMAT
========================================================== */

function formatDate(date){

    return date.toLocaleDateString(

        "sv-SE",

        {

            year:"numeric",

            month:"long",

            day:"numeric"

        }

    );

}


/* ==========================================================
   AUTO LOG
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        addLog(

            "Arkivet aktiverat."

        );

    }

);/* ==========================================================
   SAVE / LOAD (LOCAL STORAGE)
========================================================== */

function saveProgress(){

    localStorage.setItem(

        "steelArchivesProgress",

        JSON.stringify(missions)

    );

}


function loadProgress(){

    const saved =

        localStorage.getItem(

            "steelArchivesProgress"

        );

    if(!saved){

        return;

    }

    try{

        const progress = JSON.parse(saved);

        missions.forEach(

            (mission,index)=>{

                if(progress[index]){

                    mission.completed =
                        progress[index].completed;

                    mission.unlocked =
                        progress[index].unlocked;

                }

            }

        );

    }

    catch(error){

        console.error(error);

    }

}


/* ==========================================================
   COMPLETE MISSION
========================================================== */

function completeMission(id){

    const mission =

        missions.find(

            m => m.id === id

        );

    if(!mission){

        return;

    }

    mission.completed = true;

    saveProgress();

    renderMissions();

    updateIntegrity();

    addLog(

        `"${mission.title}" slutförd.`

    );

}


/* ==========================================================
   AUTO UNLOCK
========================================================== */

function unlockAvailableMissions(){

    const now = new Date();

    let changed = false;

    missions.forEach(

        mission=>{

            if(

                !mission.unlocked &&

                new Date(

                    mission.unlockDate

                ) <= now

            ){

                mission.unlocked = true;

                changed = true;

            }

        }

    );

    if(changed){

        saveProgress();

        renderMissions();

    }

}


/* ==========================================================
   STARTUP
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await loadMissions();

        loadProgress();

        unlockAvailableMissions();

        renderMissions();

        updateIntegrity();

        updateCountdown();

        setInterval(

            ()=>{

                unlockAvailableMissions();

                updateCountdown();

            },

            1000

        );

    }

);


/* ==========================================================
   DEBUG
========================================================== */

/*

För utveckling kan du använda:

completeMission(1)

eller

localStorage.clear()

i webbläsarens konsol.

*/


/* ==========================================================
   END OF FILE
========================================================== */

}
