const mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment    = require ('./models/comment');


const data = [
    {
        name: "Salmon Creek",
        image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
        description: "Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl. Swab barque interloper chantey doubloon starboard grog black jack gangway rutters."
    },
    {
        name: "Granite Hill",
        image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
        description: "Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to."
    },
    {
        name: "Mountain Goat's Rest",
        image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
        description: 'Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crows nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.'
    },
];

const seedDB = () => {
    //remove all the campgournds
    Campground.remove({}, (err) => {
        // if (err) {
        //     console.log(err);
        // } else {
        //     console.log('remove campgrounds!');
        // }
        // data.forEach((seed) => {
        //     Campground.create(seed, (err, camp) => {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log('added a campground');
        //             // creat a comment
        //             Comment.create(
        //                 {
        //                     text: "Try to be creative",
        //                     author: 'Reza is Jigar'
        //                 }, (err, comment) => {
        //                     if (err){console.log(err)}
        //                     else{
        //                         camp.comments.push(comment);
        //                         camp.save();
        //                         console.log('Created new comment!!')
        //                     }
        //                 } )
        //         };

        //     })
        // })
    });
    //add few campgrounds


    // put some comments
}


module.exports = seedDB;