let start = document.getElementById('start')
let cont = document.getElementById('continue')

start.addEventListener('click', event => {
    location.href = '/game'
})

cont.addEventListener('click', event => {
    location.href = '/game/continue'
})

