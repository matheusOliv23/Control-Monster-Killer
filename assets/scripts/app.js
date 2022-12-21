const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 18;
const MONSTER_ATTACK_VALUE = 15;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK'
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK'
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK'
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK'
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL'
const LOG_EVENT_GAME_OVER = 'GAME_OVER'



function getMaxLifeValues() {
    const enteredValue = prompt('Maximum life for you and the monster', '100')
    const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw { message: 'Invalid user input not a number' }
    }
    return parsedValue
}

let chosenMaxLife;

try {
    chosenMaxLife = getMaxLifeValues()
} catch (error) {
    chosenMaxLife = 100
}


if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100
}

let currentMonsterHealth = chosenMaxLife
let currentPlayerHealth = chosenMaxLife
let hasBonusLife = true;
let battleLog = []
let lastLogEntry = []

adjustHealthBars(chosenMaxLife)

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }

    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER'
            break
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }

            break
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: event,
                value: value,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: event,
                value: value,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break
        default:
            logEntry = {}
    }

    battleLog.push(logEntry)
}

function reset() {
    currentMonsterHealth = chosenMaxLife
    currentPlayerHealth = chosenMaxLife
    resetGame(chosenMaxLife)
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -= playerDamage

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false
        removeBonusLife()
        currentPlayerHealth = initialPlayerHealth
        setPlayerHealth(initialPlayerHealth)
        alert('You would be dead but bonus life saved you')

    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won')
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth)
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost')
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth)
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw')
        writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth)
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0 ||
        currentPlayerHealth <= 0 && currentMonsterHealth > 0 ||
        currentPlayerHealth <= 0 && currentMonsterHealth <= 0
    ) {
        reset()
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage)
    currentMonsterHealth -= damage
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth)
    endRound()
}

function attackHandler() {
    attackMonster(MODE_ATTACK)
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK)
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert('You cant heal')
        healValue = chosenMaxLife - currentPlayerHealth
    } else {
        healValue = HEAL_VALUE
    }
    increasePlayerHealth(healValue)
    currentPlayerHealth += healValue
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth)
    endRound()
}

function printLogHandler() {
    for (const logEntry of battleLog) {
        if (!lastLogEntry && lastLogEntry !== 0 || lastLogEntry < i) {
            for (const key in logEntry) {
                console.log(key)
                console.log(logEntry[key])
                console.log(`${key} => ${logEntry[key]} `)
            }
            lastLogEntry = 1;
            break
        }
        i++
    }
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)