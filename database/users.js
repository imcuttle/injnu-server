/**
 * Created by Moyu on 16/11/18.
 */
var conn = require('./base');
var format = conn.format;
var sFilter = conn.likeStrFilter;

var table = 'users';


module.exports = {
    add(id, password, img_path, sign) {
        return new Promise((resolve, reject) => {
            conn.query('insert into ?? values (?,?,NOW(),?,?)', [table, id, password, img_path, sign],
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
    update(id, key, value) {
        return new Promise((resolve, reject) => {
            conn.query('update ?? set ??=? where id=?', [table, key, value, id],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.affectedRows>0);
                }
            )
        })
    },
    updateImg(id, img_path) {
        return new Promise((resolve, reject) => {
            conn.query('update ?? set img_path=? where id=?', [table, img_path, id],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else resolve(rlt.affectedRows>0);
                }
            )
        })
    },
    get(id) {
        return new Promise((resolve, reject) => {
            conn.query('select * from ?? where id=?', [table, id],
                (err, rlt) => {
                    if(err) {console.error(err); reject(err)}
                    else {
                        if(rlt.length===0)
                            resolve(null);
                        resolve(rlt.length===1 ? rlt[0]: rlt);
                    }
                }
            )
        })
    }
}