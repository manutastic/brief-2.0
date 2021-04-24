const { eventNames } = require('gulp');
const { Client } = require('pg');

class Database {
    #connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";
    connectToDB() {
        const client = new Client({
            connectionString: this.#connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });
        client.connect();
        return client;
    }

    printAll() {
        const client = this.connectToDB();
        client.query('SELECT * FROM events;', (err, res) => {
            if (err) throw err;
            for (let row of res.rows) {
                console.log(JSON.stringify(row));
            }
            client.end();
        });
    }

    logEvent(eventType, eventName) {
        const sql = `
        INSERT INTO events (type, name)
        VALUES($1, $2)
        ON CONFLICT (type, name)
        DO UPDATE
            SET count = events.count + 1;
        `;
        const client = this.connectToDB();
        client.query(sql, [eventType, eventName], (err, res) => {
            if (err) throw err;
            client.end();
        });
    }

}

module.exports.Database = Database;
