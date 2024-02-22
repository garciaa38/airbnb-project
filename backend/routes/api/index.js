const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const { setTokenCookie } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js')
const { User } = require('../../db/models');

console.log('TEST9');
router.use(restoreUser);
console.log('TEST10');
router.use('/session', sessionRouter);
console.log('TEST11');
router.use('/users', usersRouter);
console.log('TEST12');
router.use('/spots', spotsRouter);
console.log('TEST13');
router.use('/reviews', reviewsRouter);
console.log('TEST14');
router.use('/bookings', bookingsRouter);
console.log('TEST15');
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});






















//TEST USER AUTHENTICATION
// router.get(
//     '/restore-user',
//     (req, res) => {
//       return res.json(req.user);
//     }
//   );

// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//       where: {
//         username: 'Demo-lition'
//       }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user });
//   });


module.exports = router;
