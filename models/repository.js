const mysql = require('mysql')
const table = `\`savedata\``
const db = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'othello',
}

module.exports = {
    save: function (data, saveID){
        return new Promise((resolve, reject) => {
            console.log('3')
            console.log(data)
            const con = mysql.createConnection(db)
            const sql =  saveID
                ? `UPDATE ${table} SET data='${data}' where id=${saveID};`
                : `INSERT INTO ${table} VALUES(0, '${data}');`
            con.query(sql,(err, result, fields) => {
                if(err) reject(err); 
                console.log('4')
                console.log(result) 
                let okID = result.insertID ? result.insertID : saveID
                resolve(okID)
                console.log('5')
            })
            con.end()
        })
    },
        load: function(saveID){
        return new Promise((resolve, reject) => {
            let con = mysql.createConnection(db)
            let sql = `SELECT * FROM ${table} WHERE id = ${saveID};`
            con.query(sql, (err, result, fields) => {
                if(err) reject(err);
                console.log(result[0].data)
                resolve(result[0].data)
            })  
        })
    }
}