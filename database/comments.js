/**
 * Created by Moyu on 16/11/18.
 */
var conn = require('./base');
var format = conn.format;
var sFilter = conn.likeStrFilter;

var table = 'comments';


module.exports = {
    add(user, content, forid) {
        return new Promise((resolve, reject) => {
            conn.query('insert into ?? values (NULL,?,?,NOW(),?)', [table, user, content, +forid],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.affectedRows>0);
                }
            )
        })
    },
    del(id, user) {
        return new Promise((resolve, reject) => {
            conn.query('delete from ?? where id=? and user=?', [table, +id, +user],
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
    getByUser(user) {
        return new Promise((resolve, reject) => {
            conn.query('select * from ?? where user=?', [table, user],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt);
                }
            )
        })
    },
    list(forid, page, size, previd) {
        page--;
        size = +size;
        return new Promise((resolve, reject) => {
            conn.query(
                `select * from ?? ${previd!=null?'where datetime<(select datetime from ?? where id=?) and ':'where '}for_id=? order by datetime desc limit ?,?`,
                previd!=null?[table, table, +previd, +forid, 0, size]:[table, +forid, page*size, size],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt);
                }
            )
        })
    },
    all(forid) {
        return new Promise((resolve, reject) => {
            conn.query(
                `select * from ?? where for_id=? order by datetime`,
                [table, forid],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt);
                }
            )
        })
    }
}