var express = require('express');
var jwt = require('jsonwebtoken');

var protect = express();

var njnu = require('./njnu')

var SECRET = "best-njnu-app";
protect.SECRET = SECRET
protect.getToken = getToken
protect.verifyToken = verifyToken

function verifyToken (token) {
	return jwt.verify(token, SECRET, {ignoreExpiration: true})
}

function getToken(req) {
	if (req.headers.authorization) {
	  return req.headers.authorization;
	} else if (req.query && req.query.token) {
	  return req.query.token;
	}
	return null;
}


protect.use((req, res, next) => {
	var token = getToken(req);
	if(!token) {
		res.json({code: 400, result: 'bad request'})
		return;
	}
	req.token = token;
	next();
});

protect.all('/verify', (req, res, next) => {
	try {
		res.json(verifyToken(req.token));
	} catch(ex) {
		res.json({code: 401, result: ex.message})
	}
})

protect.all('/checktoken', (req, res) => {
	try {
		var stu = verifyToken(req.token);
		if(stu.id && stu.password) {
			njnu.checkStudent(stu.id, stu.password)
			.then(f=>f ? res.json({code: 200}) : res.json({code: 404}))
		}
	} catch(ex) {
		res.json({code: 401, result: ex.message})
	}
})


module.exports = protect;