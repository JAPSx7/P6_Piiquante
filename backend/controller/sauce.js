//const { json } = require('express')
const Sauce = require('../models/Sauce')
const fs = require("fs")

//getAllSauce
exports.getAllSauce = (req, res) => {

    Sauce.find()

        .then((sauces) => { console.log(sauces[0].imageURL); res.status(200).json(sauces) })
        .catch((error) => res.status(400).json({ error }))
}
//getOneSauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}
// create sauce
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.originalname.split(' ').join('_')}`,
        likes: 0,
        dislikes: 0,
        usersLikes: [' '],
        usersDislikes: [' '],
    })

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créé' }))
        .catch((error) => res.status(400).json({ error }))
}

// modify sauce
exports.modifySauce = (req, res) => {
    let sauceObject;
    if (req.file) {
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
    } else {
        sauceObject = { ...req.body }
    }
    Sauce.updateOne(
        { _id: req.params.id }, { ...sauceObject, userId: sauceObject.userId })
        .then(res.status(200).json({ message: 'mis à jour avec succès' }))
        .catch(res.status(400).json({ error }))
}

// Delete Sauce
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageURL.split("/images/")[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(res.status(200).json({ message: "Vous avez bien supprimé cette sauce" }))
                    .catch(error => res.status(400).json({ error }))
            })
        }).catch(error => res.status(500).json({ error }))
}



//user like et dislike
exports.userLikeDislike = (req, res) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    // Sauce liked

    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            switch (like) {
                case 1:
                    if (!sauce.usersLikes.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $push: { usersLikes: userId }, $inc: { likes: +1 } })
                            .then(() => res.status(200).json({ message: `J'aime` }))
                            .catch((error) => { console.log(error); res.status(400).json({ error }) })
                        console.log(userId)
                    }
                    break;
                // Annulation du like / dislike
                case 0:

                    if (sauce.usersLikes.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersLikes: userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: `Neutre` }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                    if (sauce.usersDislikes.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersDislikes: userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: `Neutre` }))
                            .catch((error) => res.status(400).json({ error }))
                    }

                    break;
                // Sauce Disliked et mise à jour avec des nouvelles valeurs
                case -1:
                    if (!sauce.usersDislikes.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $push: { usersDislikes: userId }, $inc: { dislikes: +1 } })
                            .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
                            .catch((error) => res.status(400).json({ error }))
                    }
                    break;

                default:
                    console.log(error);
            }

        })
        .catch((error) => { console.log(error); res.status(404).json({ error }) })
}
