const express = require('express');
const router = express.Router();
const User = require("../../models/User");
const Painting = require("../../models/Painting");
const requireLogin = require("../../config/utils")

router.get("/wishlist", requireLogin, (req, res) => {
  let paintings = {
    paintings: []
  }
  User.findById(req.session.currentUser)
    .then((result) => {
      result.wishlist.forEach(element => {
        Painting.findById(element.paintingID)
          .then((paint) => {
            paintings.paintings.push(paint)
          })
      });
      console.log(paintings)
      res.render("Wishlist/wishlist", {paintings: paintings.paintings, user: req.session.currentUser})
    })
})




router.post('/addWishlist/:id', (req, res, next) => {
  let paintingID = req.params.id;
  if (req.session.currentUser) {
    User.findById(req.session.currentUser)
      .then((result) => {
        let isInArray = result.wishlist.some(function (painting) {
          return painting.paintingID.equals(paintingID);
        });
        if (!isInArray) {
          User.findByIdAndUpdate(req.session.currentUser,
            { $push: { wishlist: { paintingID } } }
          ).then((result) => {
            res.redirect(`/showRandom`)
          }).catch((err) => {
            console.log(err)
          })
        } else {
          Painting.findById(paintingID)
            .then((painting) => {
              res.render('Painting/random', { painting: [painting],
                errorMessage: "You already have this painting in your wishlist"
              });
            })
        }
      })
  }else{
    Painting.findById(paintingID)
            .then((painting) => {
              res.render('Painting/random', { painting: [painting],
                errorMessage: "Please login to add paintings to your account"
              });
            })
  }
});

module.exports = router;
