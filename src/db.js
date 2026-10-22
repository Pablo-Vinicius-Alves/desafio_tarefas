import mariadb from 'mariadb';

function conectarDb(){
    const con = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWO,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    })
    return con;
}

export default conectarDb;