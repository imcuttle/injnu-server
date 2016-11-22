/**
 * Created by Moyu on 16/11/18.
 */
var conn = require('./base');
var format = conn.format;
var sFilter = conn.likeStrFilter;

var table = 'discusses';


module.exports = {
    add(title, sender, datetime, content) {
        return new Promise((resolve, reject) => {
            conn.query('insert into ?? values (NULL,?,?,?,?)', [table, title, sender, datetime, content],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.affectedRows>0);
                }
            )
        })
    },
    check(id) {
        return this.get(id).then(r=>!!r)
    },
    get(id) {
        return new Promise((resolve, reject) => {
            conn.query('select * from ?? where id=?', [table, id],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.length===0 ? null: rlt.length===1 ? rlt[0]: rlt);
                }
            )
        })
    },
    del(id, user) {
        return new Promise((resolve, reject) => {
            conn.query('delete from ?? where id=? and sender=?', [table, +id, +user],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.affectedRows>0);
                }
            )
        })
    },
    getByUser(user) {
        return new Promise((resolve, reject) => {
            conn.query('select * from ?? where sender=?', [table, user],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt);
                }
            )
        })
    },
    list(page, size, previd) {
        page--;
        size = +size;
        return new Promise((resolve, reject) => {
            conn.query(
                `select * from ?? ${!!previd?'where datetime<(select datetime from ?? where id=?) ':''}order by datetime desc limit ?,?`,
                !!previd?[table, table, +previd, 0, size]:[table, page*size, size],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.length===0 ? null: rlt);
                }
            )
        })
    },
    listByUser(id, page, size, previd) {
        page--;
        size = +size;
        return new Promise((resolve, reject) => {
            conn.query(
                `select * from ?? where ${!!previd?'datetime<(select datetime from ?? where id=?) and':''} sender=? order by datetime desc limit ?,?`,
                !!previd?[table, table, +previd, id, 0, size]:[table, id, page*size, size],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.length===0 ? null: rlt);
                }
            )
        })
    }
}