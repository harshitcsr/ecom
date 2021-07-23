const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../db/config');
const admin = require('../model/admin');
const products = require('../model/productadd');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/adminregister', async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
        res.send("Please fill form");
    } else {
        if (await admin.findOne({ email: email })) {
            res.send("Email already exist");
        } else {
            const pass = await bcrypt.hash(password, 12);
            const newUser = new admin({ name, email, phone, password: pass, role });
            await newUser.save().then((result) => {
                console.log("Saved data");
            }).catch((err) => {
                console.log("Some error" + err);
            })
        }
    }
})

router.post('/adminsignin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Please fill data properly");
        }
        else {
            var check = await admin.findOne({ email: email })
                .then((result) => {
                    const isMatch = bcrypt.compareSync(password, result.password);
                    if (!isMatch) {
                        console.log("Not a valid user");
                    } else {
                        const key = process.env.SECRETKEY;
                        const token = jwt.sign({ _id: result.id }, key);
                        session = req.session;
                        session.role = result.role;
                        console.log(req.session)
                    }
                }).catch((err) => {
                    console.log("Not a valid User");
                })

        }
    } catch (err) {
        console.log("Some error" + err);
    }
});

router.post('/addproduct', async (req, res) => {

    if (session.userid == "role") {
        const { name, price, description, discount, finalprice } = req.body;
        if (!name || !price || !description || !discount || !finalprice) {
            console.log("Enter item Properly");
        } else {
            const product = new products({ name, price, description, discount, finalprice });
            await product.save().then((result) => {
                console.log("Saved data");
            }).catch((err) => {
                console.log("Some error" + err);
            })
        }
    } else {
        console.log("You are not admin");
    }

})

router.get('/vieworders', async (req, res) => {
    if (session.userid == "role") {
    await products.find().then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
    })
    }else{
        console.log("Login first as Admin");
    }
})


module.exports = router;