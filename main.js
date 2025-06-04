const selfTasks = ["Brush your Teeth", "Stretch", "Eat a Healthy Snack", "Drink Water", "Take a Walk", "Go Outside", "Take a Shower", "Put on Sunscreen", "Listen to Music", "Take Medication", "Read for 20 Minutes", "Do Laundry", "Make Your Bed", "Wash Your Face", "Clean Your Room", "Learn Something New", "Take a Bath", "Eat Fruit", "Meditate for 10 Minutes", "Take Vitamins"];
const worldTasks = ["Attend Local Band Concert", "Attend a Protest", "Talk to a Neighbor", "Go Thrifting", "Visit Farmer's Market", "Pick up Litter", "Donate to a Non-Profit", "Donate to a GoFundMe", "Drive a Friend Around", "Check Out a Library Book", "Give Food to Neighbors", "Give a Useful Item to an Unhoused Person", "Visit a Museum", "Buy Stamps", "Visit Local Library", "Learn a Language for 30 minutes", "Learn a New Recipe", "Create a Zine", "Participate in a Local Event", "Ride the Bus", "Sign up to Volunteer"];

var gameData = {
    clevel: 0,
    cprogress: 0,
    cprog_max: 10,
    wlevel: 0,
    wprogress: 0,
    wprog_max: 100000000
}

var tasks = {

}

// Function to open the corresponding tab content
function openPage(pageName, elmnt, color) {
    var i, tabcontent, tablinks;

    // Hide all tab content
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}

function refreshPageDaily(hour, minute) {
    function checkAndRefresh() {
      const now = new Date();
      if (now.getHours() === hour && now.getMinutes() === minute) {
        saveDailyData();
        window.location.reload();
      }
    }
    checkAndRefresh(); // Check immediately when the script loads
    setInterval(checkAndRefresh, 60000); // Check every minute
}

// Refresh tasks at 23:56 each day
refreshPageDaily(23, 56);

function critterBox(elmnt) {
    let progress = document.getElementById("critter_exp");
    if (elmnt.checked) {
        gameData.cprogress += 5;
        progress.value = gameData.cprogress;
        if (progress.value >= progress.max) {
            updateCritterLvl(1);
        }
        else {
            updateCProgress();
        }
    }
    else {
        gameData.cprogress = gameData.cprogress - 5;
        progress.value = gameData.cprogress;
        if (gameData.cprogress < 0 && gameData.clevel > 0) {
            updateCritterLvl(-1);
        }
        else {
            updateCProgress();
        }
    }
}

function updateCProgress() {
    let fraction = document.getElementById("critter_progress");
    fraction.innerHTML = gameData.cprogress + "/" + gameData.cprog_max;
}

function updateCritterLvl(direction) {
    let critterLevel = document.getElementById("critter_lvl");
    let progress = document.getElementById("critter_exp");
    if (direction > 0) {
        gameData.clevel += 1;
        critterLevel.innerHTML = "Critter Level: " + gameData.clevel;
        gameData.cprogress -= gameData.cprog_max;
        gameData.cprog_max = Math.round(gameData.cprog_max*1.1);
        progress.value = gameData.cprogress;
        progress.max = gameData.cprog_max;
        updateCProgress();
    }

    if (direction < 0) {
        gameData.clevel -= 1;
        critterLevel.innerHTML = "Critter Level: " + gameData.clevel;
        gameData.cprogress += gameData.cprog_max - 1;
        gameData.cprog_max /= 1.1;
        progress.value = gameData.cprogress;
        progress.max = gameData.cprog_max;
        updateCProgress();
    }

    updateCritterPic();
}

function updateCritterPic() {
    image = document.getElementById("critter_img");
    if (gameData.clevel < 10) {
        image.src = "images/critter/kity1.png";
        image.alt = "Baby Kitten";
    }
    else if (10 <= gameData.clevel && gameData.clevel < 20) {
        image.src = "images/critter/kity2.png";
        image.alt = "Adult Kitten";
    }
    else if (gameData.clevel >= 20) {
        image.src = "images/critter/kity3.png";
        image.alt = "Godly Kitten";
    }
}

function worldBox(elmnt) {
    const progress = document.getElementById("world_exp");

    // Ensure progress values are valid and that max is initialized
    if (isNaN(gameData.wprogress) || isNaN(progress.max) || progress.max <= 0) {
        console.error("Invalid progress value in worldBox", gameData.wprogress, progress.max);
        return;
    }

    if (elmnt.checked) {
        gameData.wprogress += 10000000;  // Add progress for completed task
        progress.value = gameData.wprogress;
        if (gameData.wprogress >= progress.max) {
            updateWorldLvl(1);  // Trigger level-up if progress exceeds max
        } else {
            updateWProgress();  // Update the progress fraction
        }
    } else {
        gameData.wprogress = Math.max(0, gameData.wprogress - 5);  // Cap at 0
        progress.value = gameData.wprogress;
        if (gameData.wprogress === 0 && gameData.wlevel > 0) {
            updateWorldLvl(-1);  // Trigger level-down if progress is negative
        } else {
            updateWProgress();  // Update the progress fraction
        }
    }
}

function updateWorldLvl(direction) {
    let worldLevel = document.getElementById("world_lvl");
    let progress = document.getElementById("world_exp");

    // Check if progress exceeds max value
    if (direction > 0) {
        gameData.wlevel += 1;
        worldLevel.innerHTML = "World Level: " + gameData.wlevel;

        // Increase max progress and reset progress value
        gameData.wprogress -= gameData.wprog_max;  // Subtract the current progress before increasing max
        gameData.wprog_max *= 1.1;  // Increase the max progress (e.g., by 10%)
        progress.value = gameData.wprogress;
        progress.max = gameData.wprog_max;

        console.log("World level-up! New level:", gameData.wlevel);
        updateWProgress();  // Update the progress fraction
    }

    if (direction < 0) {
        gameData.wlevel -= 1;
        worldLevel.innerHTML = "World Level: " + gameData.wlevel;

        // Decrease max progress and adjust current progress
        gameData.wprogress += gameData.wprog_max - 1;  // Revert progress before decreasing max
        gameData.wprog_max /= 1.1;  // Decrease the max progress (e.g., by 10%)
        progress.value = gameData.wprogress;
        progress.max = gameData.wprog_max;

        console.log("World level-down! New level:", gameData.wlevel);
        updateWProgress();  // Update the progress fraction
    }

    updateWorldPic();  // Update the world image based on the level
}


function updateWProgress() {
    const fraction = document.getElementById("world_progress");
    const progress = document.getElementById("world_exp");

    // Update the fraction text to show current progress / max progress
    fraction.innerHTML = `${progress.value} / ${progress.max}`;
}


function updateWorldPic() {
    image = document.getElementById("world_img");
    if (gameData.wlevel < 1) {
        image.src = "images/planet/planet1.png";
        image.alt = "Dirty World"
    }
    else if ( 1 <= gameData.wlevel && gameData.wlevel < 2) {
        image.src = "images/planet/planet2.png";
        image.alt = "Nice World"
    }
    else if (gameData.wlevel >= 2) {
        image.src = "images/planet/planet3.png";
        image.alt = "Perfect World"
    }
}

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("critterSave", JSON.stringify(gameData))
}, 1000);

var savegame = JSON.parse(localStorage.getItem("critterSave"))
if (savegame !== null) {
    gameData = savegame;
}

// Save tasks to localStorage
function saveDailyData() {
    const newSelfData = getRandomItems(selfTasks, 3);  // Get 3 random self-care tasks
    const newWorldData = getRandomItems(worldTasks, 3);  // Get 3 random world-care tasks

    // Save the tasks to localStorage as JSON strings
    localStorage.setItem("dailySelfTasks", JSON.stringify(newSelfData));
    localStorage.setItem("dailyWorldTasks", JSON.stringify(newWorldData));

    console.log("Daily tasks saved:", newSelfData, newWorldData);
}

// Get random items from an array
function getRandomItems(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Update tasks from localStorage when the page loads
function updateTasks() {
    const newSelfData = JSON.parse(localStorage.getItem("dailySelfTasks"));
    const newWorldData = JSON.parse(localStorage.getItem("dailyWorldTasks"));

    if (newSelfData && newWorldData) {
        // Update self-care tasks
        document.getElementById("ctask1_label").textContent = newSelfData[0];
        document.getElementById("ctask2_label").textContent = newSelfData[1];
        document.getElementById("ctask3_label").textContent = newSelfData[2];

        // Update world-care tasks
        document.getElementById("wtask1_label").textContent = newWorldData[0];
        document.getElementById("wtask2_label").textContent = newWorldData[1];
        document.getElementById("wtask3_label").textContent = newWorldData[2];

        console.log("Tasks updated from localStorage.");
    } else {
        console.log("No tasks found in localStorage.");
    }
}

function saveGame() {
    localStorage.setItem("critterSave", JSON.stringify(gameData));
}

function resetGame() {
    localStorage.removeItem("critterSave");
    gameData = {
        clevel: 0,
        cprogress: 0,
        cprog_max: 10,
        wlevel: 0,
        wprogress: 0,
        wprog_max: 100000000
    };
    // Reset UI elements
    document.getElementById("critter_exp").value = 0;
    document.getElementById("critter_progress").innerHTML = "0/10";
    document.getElementById("critter_lvl").innerHTML = "Critter Level: 0";
    document.getElementById("world_exp").value = 0;
    document.getElementById("world_progress").innerHTML = "0/100000000";
    document.getElementById("world_lvl").innerHTML = "World Level: 0";

    // Reset checkbox states
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        localStorage.removeItem(checkbox.id);
    });

    window.location.replace(window.location.href);
}


// Function to save checkbox states to Local Storage
function saveCheckboxStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      localStorage.setItem(checkbox.id, checkbox.checked);
    });
  }
  
  // Function to load checkbox states from Local Storage
  function loadCheckboxStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const savedState = localStorage.getItem(checkbox.id);
      if (savedState !== null) {
        checkbox.checked = savedState === 'true';
      }
    });
  }
  
  // Attach event listener to the checkboxes to save their states
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', saveCheckboxStates);
  });


  document.addEventListener("DOMContentLoaded", function () {
    // Tab content logic
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById("defaultOpen").click();

    // World progress max init
    const progress = document.getElementById("world_exp");
    if (progress.max === 0) {
        progress.max = 100000000;
    }

    // Task handling
    if (!localStorage.getItem("dailySelfTasks") || !localStorage.getItem("dailyWorldTasks")) {
        saveDailyData();
    }
    updateTasks();
    updateWProgress();
    updateCProgress();
    loadCheckboxStates();
});
