const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                const token = jwt.sign({
                                    email: result.email,
                                    userId: result._id
                                }, 
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "1h"
                                });
                                res.status(201).json({
                                    message: 'User created',
                                    token: token
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                });
            }
        })    
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        message: 'Auth failed'
                    })
                }

                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h",
                    });
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }

                return res.status(404).json({
                    message: 'Auth failed'
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}


exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id : req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

