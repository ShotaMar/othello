export function initBoard(turn, cashPosition, estimates){
    let board = document.querySelector('tbody')
    for(let i = 1; i < 9; i++){
        let row = document.createElement('tr')
        for(let j = 1; j < 9; j++){
            let mass = document.createElement('td')
            mass.classList.add('mass')
            mass.id = `${i}${j}`
            mass.innerText = `${i}${j}`
            if(mass.id === '45'||mass.id === '54'){
                mkStone(mass, 'blk')
                cashPosition["blk"].push(Number(`${i}${j}`))
            }
            if(mass.id === '44'||mass.id === '55'){
                mkStone(mass, 'wht')
                cashPosition.wht.push(Number(`${i}${j}`))
            }
            mass.addEventListener('click', () => {
                //ひっくり返すところがなければ何もしない
                if(!estimates[mass.id]){ return }
                putStone(mass, turn, cashPosition, estimates)
            }) 
            row.appendChild(mass)
        }
        board.appendChild(row)    
    }
}

//置ける場所と裏返る石をキャッシュに保存
export function searchAvailablePut(turn, cashPosition, estimates){
    const outOfField = /[1-8]{2}/
    const vector = [-10,-9,1,11,10,9,-1,-11]
    let enemyCol = turn === 'blk'? 'wht':'blk'

    //自色の石の置かれている座標のリスト
    cashPosition[turn].forEach( xy => {
        let curentP = xy
        vector.forEach( v => {
            let estimatePs = []
            while(true) {
                curentP += v
                if(curentP < 0 || !String(curentP).match(outOfField)){ 
                    curentP = xy
                    break }
                if(cashPosition[turn].includes(curentP)){ 
                    curentP = xy
                    break }
                if(cashPosition[enemyCol].includes(curentP)){ 
                    estimatePs.push(curentP) 
                    continue }
                if(!estimatePs.length){ 
                    curentP = xy
                    break }

                cashPosition[`${turn}IsPass`] = false   
                estimates[curentP] = curentP in estimates? estimates[curentP].concat(estimatePs) : estimatePs
                curentP = xy
                break
            }
        })
    });
    console.log(estimates)

    //ゲームセット判定
    if(isGameSet(cashPosition, turn)){
        gameSet(cashPosition)
        return
    }
    //置ける場所がない場合
    if(!Object.keys(estimates).length){
        //パス連続２回目以降の場合
        if(cashPosition[`${turn}IsPass`]){
            cashPosition[`${turn}PassTime`]++
        }else{
            cashPosition[`${turn}PassTime`] = 1
        }
        cashPosition[`${turn}IsPass`] = true   
        alert('置ける場所がありません！\n相手のターンになります')
        turn = enemyCol
        estimates = {}
        searchAvailablePut(turn, cashPosition, estimates)
    }
}

function putStone(mass, turn, cashPosition, estimates){
    let enemyCol = turn === 'blk'? 'wht': 'blk'
    //石を置く
    mkStone(mass, turn)
    //自色のキャッシュに石を置いた場所を保存
    cashPosition[turn].push(Number(mass.id))
    //置いた場所に対応するひっくり返せる石をひっくり返す
    estimates[mass.id].forEach( p => {
        let enemeyS = document.getElementById(p)
        enemeyS.classList.add(turn)
        enemeyS.classList.remove(enemyCol)
        //自色のキャッシュに保存
        cashPosition[turn].push(p)
        let removeIndex = cashPosition[enemyCol].indexOf(p)
        cashPosition[enemyCol].splice(removeIndex, 1)
    })
    console.log(cashPosition)
    estimates = {}
    turn = enemyCol
    searchAvailablePut(turn, cashPosition, estimates)
}

export function mkStone(mass, turn){
    let stone = document.createElement('div')
    stone.classList.add(`stone`)
    mass.classList.add(turn)
    mass.appendChild(stone)
}

export function isGameSet(cashPosition, turn){
    let enemyCol = turn === 'blk'? 'wht':'blk'
    let totalPut = cashPosition.blk.length + cashPosition.wht.length
    let myIsPass = cashPosition[`${turn}IsPass`]
    let enemyIsPass = cashPosition[`${enemyCol}IsPass`]

    if(totalPut.length === 64){ return true }
    if(cashPosition[`${turn}PassTime`] === 3){ return true }
    if(myIsPass && enemyIsPass){ return true }
    if(!cashPosition['blk'].length || !cashPosition['wht'].length){ return true }
    
    return false
}

export function gameSet(cashPosition){
    let blkResult = cashPosition.blk.length
    let whtResult = cashPosition.wht.length
    let winner = blkResult > whtResult? '黒の勝ち！':'白の勝ち！'
    alert(`${winner}\n黒：${blkResult}\n白：${whtResult}`)


}