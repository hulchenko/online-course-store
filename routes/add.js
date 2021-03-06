const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const { validationResult } = require('express-validator/check');
const router = Router();

router.get('/', auth, (req, res) => {
  //BEFORE ENGINE:
  //   res.sendFile(path.join(__dirname, 'views', 'about.html'));
  res.render('add', {
    title: 'Add Course',
    isAdd: true,
  });
});

router.post('/', auth, courseValidators, async (req, res) => {
  // LOCAL: const course = new Course(req.body.title, req.body.price, req.body.img);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add Course',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      },
    });
  }
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });

  try {
    await course.save();
  } catch (e) {
    console.log(e);
  }

  res.redirect('/courses');
});

module.exports = router;
