let express = require('express')
let router = express.Router()
let repository = require('../models/repository')

router.get('/', (req, res, next) => {
    let data = {
        title: 'game start',
        content: 'this page is to start game',
        saveData: JSON.stringify({
            position: {blk:[45,54],wht:[44,55]},
            turn: 'blk'
        })
    } 
    res.render('game', data)
})

router.get('/continue', async (req, res, next) => {
    let result
    if(req.cookies.saveID){
        let saveID = req.cookies.saveID
        result = await repository.load(saveID)
    }
    let data = {
        title: 'wellcome back',
        content: 'this page is to continue game',
        saveData: result ?? undefined
    }
    res.render('game', data)
})

router.post('/save', async (req, res, next) => {
        let saveData = JSON.stringify(req.body)
        let saveID = req.cookies.saveID ?? 0 
        console.log('2')
        let result = await repository.save(saveData, saveID).catch(err => console.log(err))
        console.log('6')
        console.log(result)
        res.cookie('saveID', result)
        res.send({'msg':'saveが完了しました'})
})

module.exports = router