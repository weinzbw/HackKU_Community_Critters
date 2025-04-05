var gameData = {
    tests: 0,
    testsPerClick: 1,
    testPerClickCost: 10
}

function finishTest() {
    gameData.tests += gameData.testsPerClick
    document.getElementById("testsFinished").innerHTML = gameData.tests + " Tests Finished"
}

function buyTestPerClick() {
    if (gameData.tests >= gameData.testPerClickCost) {
        gameData.tests -= gameData.testPerClickCost
        gameData.testsPerClick += 1
        gameData.testPerClickCost = 2 * gameData.testPerClickCost
        document.getElementById("testsFinished").innerHTML = gameData.tests + " Tests Finished"
        document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pencil (Currently Level " + gameData.testsPerClick + ") Cost: " + gameData.testPerClickCost + " Tests"
    }
}

var mainGameLoop = window.setInterval(function() {
    finishTest()
}, 1000)

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("testFinisherSave", JSON.stringify(gameData))
}, 15000)

var savegame = JSON.parse(localStorage.getItem("testFinisherSave"))
if (savegame !== null) {
    gameData = savegame
}