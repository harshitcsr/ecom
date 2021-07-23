const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../db/config');
const users = require('../model/users');
const order = require('../model/cart');
const products = require('../model/productadd');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sessions = require('express-session')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router.post('/userregister', async (req, res) => {
    const { name, email, phone, password, address } = req.body;
    if (!name || !email || !phone || !password || !address) {
        res.send("Please fill form");
    } else {
        if (await users.findOne({ email: email })) {
            res.send("Email already exist");
        } else {
            const pass = await bcrypt.hash(password, 12);
            const newUser = new users({ name, email, phone, password: pass, address });
            await newUser.save().then((result) => {
                console.log("Saved data");
            }).catch((err) => {
                console.log("Some error" + err);
            })
        }
    }
})
const oneDay = 1000 * 60 * 60 * 24;
router.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
router.post('/usersignin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Please fill data properly");
        }
        else {
            var check = await users.findOne({ email: email })
                .then((result) => {
                    const isMatch = bcrypt.compareSync(password, result.password);
                    if (!isMatch) {
                        console.log("Not a valid user");
                    } else {
                        // const key = process.env.SECRETKEY;
                        // const token = jwt.sign({ _id: result.id }, key);
                        session = req.session;
                        session.userid = email;
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

router.get('/browseproduct', async (req, res) => {
    await products.find().then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
    })
})

router.post('/browseproduct/cart', async (req, res) => {
    session = req.session;
    if (session.userid) {
        await products.findById(req.body._id)
            .then(product => {
                if (!product) {
                    return res.status(404).json({
                        message: "Product not found"
                    });
                } else {
                    console.log(product.price);
                    console.log(product);
                    const orders = new order({
                        productId: mongoose.Types.ObjectId(),
                        price: product.price,
                        address: req.body.address,
                        phone: req.body.phone,
                        orderbyCustomer: req.body.customerName,
                    });
                    return orders.save();
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            })
    } else {
        res.send("Please login First");
    }
})

router.get('/myorder', async (req, res) => {
    session = req.session;
    if (session.userid) {
        await order.findbyid({email:session.userid}).then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
        })
    }
    else {
        res.send("Please login first");
    }
})
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;