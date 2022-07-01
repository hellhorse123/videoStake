const { Router, json } = require('express');
const session = require('express-session');
const config = require('config');
const cookieParser = require('cookie-parser');
const User = require('../models/users');

const MongoStore = require('connect-mongo')(session);

const authAPI = require('../utils/authAPI');
const { ensureAuthenticated } = require('../utils/authUtils/auth');
const passport = require('passport');

require('../utils/authUtils/passport')(passport);
require('../utils/authUtils/passport-google');
require('../utils/authUtils/passport-vk');
require('../utils/authUtils/passport-facebook');


const router = Router();

router.use(json());
router.use(cookieParser());

router.use(session({
	secret: 'LolIDK',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		url: config.get('dbURL')
	})
}))

router.use(passport.initialize());
router.use(passport.session());

// Google Аутентификация
router.get('/api/auth/google', passport.authenticate('google'));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
	function (req, res) {
		res.redirect('/');
	});

// VK Аутентификация

router.get('/api/auth/vkontakte', passport.authenticate('vkontakte'));

router.get('/api/auth/vkontakte/callback',
	passport.authenticate('vkontakte', {
		successRedirect: '/',
		failureRedirect: '/login'
	})
);

router.get('/api/auth/facebook', passport.authenticate('facebook'));

router.get('/api/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));


router.post('/api/auth/login', passport.authenticate('local'), async (req, res) => {
	res.send('Successfully authenticated!')
});

router.post('/api/auth/register', json(), async (req, res) => {
	const userData = req.body;

	authAPI.getUser({ $or: [{ email: userData.email }, { nickname: userData.nickname }] })
		.then(user => {
			if (user) {
				res.status(200).send('This email already exists!');
			} else {
				authAPI.saveUser(userData)
					.then(user => {
						res.status(200).send("Successfully created!");
					})
					.catch(() => {
						res.status(401).send('Check entered data')
					});
			}
		})
})

router.post('/api/auth/update', json(), async (req, res) => {
	const userData = req.body;

	authAPI.updateUser(userData);
})

router.post('/api/auth/card', json(), async (req, res) => {
	const cardData = req.body;

	await User.updateOne({ '_id': req.session.passport.user }, {'cardNumber': cardData.card})
		.then(() => {
			res.status(200).send("Successfully created!");
		})
})

router.get('/api/auth/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});


router.get('/api/auth/isauthorized', async (req, res) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		try {
			let userData = await authAPI.getUser({ '_id': req.session.passport.user });
			res.status(200).send(JSON.stringify(userData));
		} catch (e) {
			res.status(401).send(JSON.stringify({ "_id": null }))

		}
	} else {
		res.status(401).send(JSON.stringify({ "_id": null }))

	}
})

module.exports = router;
