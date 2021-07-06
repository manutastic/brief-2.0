const { Database } = require('./db.js');
const db = new Database;

const client = db.connectToDB();

client.query('SELECT * FROM events;', (err, res) => {
    if (err) console.error(err);
    client.end()
    const data = {};
    for (let row of res.rows) {
        data[row.type + '_' + row.name] = row.count;
    }
    console.log(data);
    
    const columns = Object.keys(data);
    let sql = `ALTER TABLE eventHistory `;
    for (let column of columns) {
        sql += `ADD COLUMN IF NOT EXISTS ${column} TEXT, `;
    }
    sql = sql.substring(0, sql.length - 2);
    sql += ';';

    const addColClient = db.connectToDB();
    addColClient.query(sql, (err) => {
        if (err) console.error(err);
        const columnNames = columns.join(',');
        const values = Object.values(data).join(',');
        const sql = `
            INSERT INTO events (${columnNames})
            VALUES(${values})
            `;
        const addRowClient = db.connectToDB();
        addRowClient.query(sql, (err) => {
            if (err) console.error(err);
            addRowClient.end()
        })
        addColClient.end();
    });
    

});