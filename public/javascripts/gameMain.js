// import {Game} from './indexLogic'


class Game{
    constructor(saveData){
        this.turn = saveData.turn
        this.position = saveData.position  
        this.estimates = {}
        return this
    }

    start(){
        this.initBoard(this.turn, this.position, this.estimates)
        this.searchAvailablePut(this.turn, this.position, this.estimates)
    }

    initBoard(turn, position, estimates){
        let board = document.querySelector('tbody')
        for(let i = 1; i < 9; i++){
            let row = document.createElement('tr')
            for(let j = 1; j < 9; j++){
                let mass = document.createElement('td')
                mass.classList.add('mass')
                mass.id = `${i}${j}`
                mass.innerText = `${i}${j}`
                if(position['blk'].includes(Number(mass.id))){
                    this.mkStone(mass, 'blk')
                }
                if(position['wht'].includes(Number(mass.id))){
                    this.mkStone(mass, 'wht')
                }
                // if(mass.id === '45'||mass.id === '54'){
                //     this.mkStone(mass, 'blk')
                //     this.position["blk"].push(Number(`${i}${j}`))
                // }
                // if(mass.id === '44'||mass.id === '55'){
                //     this.mkStone(mass, 'wht')
                //     this.position.wht.push(Number(`${i}${j}`))
                // }
                mass.addEventListener('click', () => {
                    //ひっくり返すところがなければ何もしない
                    if(!this.estimates[mass.id]){ return }
                    this.putStone(mass, this.turn, this.position, this.estimates)
                }) 
                row.appendChild(mass)
            }
            board.appendChild(row)    
        }
    }

    mkStone(mass, turn){
        let stone = document.createElement('div')
        stone.classList.add(`stone`)
        mass.classList.add(turn)
        mass.appendChild(stone)
    }

    putStone(mass, turn, position, estimates){
        let enemyCol = this.enemy()
        //石を置く
        this.mkStone(mass, turn)
        //自色のキャッシュに石を置いた場所を保存
        this.position[turn].push(Number(mass.id))
        //置いた場所に対応するひっくり返せる石をひっくり返す
        estimates[mass.id].forEach( p => {
            let enemeyS = document.getElementById(p)
            enemeyS.classList.add(turn)
            enemeyS.classList.remove(enemyCol)
            //自色のキャッシュに保存
            this.position[turn].push(p)
            let removeIndex = position[enemyCol].indexOf(p)
            this.position[enemyCol].splice(removeIndex, 1)
        })
        console.log(this.position)
        this.estimates = {}
        this.turn = enemyCol
        this.searchAvailablePut(this.turn, this.position, this.estimates)
    }

    //置ける場所と裏返る石をキャッシュに保存
    searchAvailablePut(turn, position, estimates){
        const outOfField = /[1-8]{2}/
        const vector = [-10,-9,1,11,10,9,-1,-11]
        let enemyCol = this.enemy()
        document.getElementById('turn').textContent = turn
        console.log(turn)

        //自色の石の置かれている座標のリスト
        position[turn].forEach( xy => {
            let curentP = xy
            vector.forEach( v => {
                let estimatePs = []
                while(true) {
                    curentP += v
                    if(curentP < 0 || !String(curentP).match(outOfField)){ 
                        curentP = xy
                        break }
                    if(position[turn].includes(curentP)){ 
                        curentP = xy
                        break }
                    if(position[enemyCol].includes(curentP)){ 
                        estimatePs.push(curentP) 
                        continue }
                    if(!estimatePs.length){ 
                        curentP = xy
                        break }

                    this.position[`${turn}IsPass`] = false   
                    this.estimates[curentP] = estimates[curentP]? estimates[curentP].concat(estimatePs) : estimatePs
                    curentP = xy
                    break
                }
            })
        });
        console.log(this.estimates)

        //ゲームセット判定
        if(this.isGameSet(this.position, this.turn)){
            this.gameSet(this.position)
            return
        }
        //置ける場所がない場合
        if(!Object.keys(this.estimates).length){
            this.pass(this.turn, this.position, this.estimates)
            this.searchAvailablePut(this.turn, this.position, this.estimates)
        }
    }
    
    isGameSet(position, turn){
        let enemyCol = this.enemy()
        let totalPut = position.blk.length + position.wht.length
        let myIsPass = position[`${turn}IsPass`]
        let enemyIsPass = position[`${enemyCol}IsPass`]
    
        if(totalPut.length === 64){ return true }
        if(position[`${turn}PassTime`] === 3){ return true }
        if(myIsPass && enemyIsPass){ return true }
        if(!position['blk'].length || !position['wht'].length){ return true }
        
        return false
    }

    gameSet(position){
        let blkResult = position.blk.length
        let whtResult = position.wht.length
        let winner = blkResult > whtResult? '黒の勝ち！':'白の勝ち！'
        alert(`${winner}\n黒：${blkResult}\n白：${whtResult}`)
    }

    pass(turn, position, estimates){
        //パス連続２回目以降の場合
        if(position[`${turn}IsPass`]){
            position[`${turn}PassTime`]++
        }else{
            position[`${turn}PassTime`] = 1
        }
        position[`${turn}IsPass`] = true   
        alert('置ける場所がありません！\n相手のターンになります')
        this.turn = this.enemy()
        this.estimates = {}
    }

    enemy(){
        return this.turn === 'blk'? 'wht':'blk' 
    }

    continue(turn, position){
        this.turn = turn
        this.position = position
        this.loadBoard(this.position)
        this.searchAvailablePut(this.turn, this.position, this.estimates)
    }

    loadBoard(position){
        let board = document.querySelector('tbody')
        for(let i = 1; i < 9; i++){
            let row = document.createElement('tr')
            for(let j = 1; j < 9; j++){
                let mass = document.createElement('td')
                mass.classList.add('mass')
                mass.id = `${i}${j}`
                mass.innerText = `${i}${j}`
                if(position['blk'].includes(Number(mass.id))){ this.mkStone(mass, 'blk') }
                if(position['wht'].includes(Number(mass.id))){ this.mkStone(mass, 'wht') }
            
                mass.addEventListener('click', () => {
                    //ひっくり返すところがなければ何もしない
                    if(!this.estimates[mass.id]){ return }
                    this.putStone(mass, this.turn, this.position, this.estimates)
                }) 
                row.appendChild(mass)
            }
            board.appendChild(row)    
        }
    }
}

//===========================================================
//ここからメイン
//===========================================================
let data = document.getElementById('saveData').textContent
let save = document.getElementById('save')
let quit = document.getElementById('quit')
let saveData = JSON.parse(data) 
let game = saveData ? new Game(saveData) : new Game()

game.start()

save.addEventListener('click', async() => {
    const data = {
        'turn': game.turn,
        'position': game.position
    }
    const param = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    console.log('1')
    let res = await fetch('/game/save', param).catch(err => console.log(err))
    let resJ = await res.json()
    console.log(resJ)
})

quit.addEventListener('click', () => {
    location.href = '/'
})