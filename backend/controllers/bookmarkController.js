const Bookmark = require('../models/Bookmark');

// ================= ADD BOOKMARK =================

exports.addBookmark = async (req, res) => {

    try {

        const { session, expo } = req.body;

        if (!session || !expo) {

            return res.status(400).json({
                message: 'Session and Expo are required'
            });
        }

        // check existing bookmark
        const existing = await Bookmark.findOne({
            attendee: req.user.id,
            session
        });

        if (existing) {

            return res.status(409).json({
                message: 'Already bookmarked'
            });
        }

        const bookmark = await Bookmark.create({
            attendee: req.user.id,
            session,
            expo
        });

        res.status(201).json(bookmark);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// ================= REMOVE BOOKMARK =================

exports.removeBookmark = async (req, res) => {

    try {

        await Bookmark.findOneAndDelete({
            attendee: req.user.id,
            session: req.params.sessionId
        });

        res.json({
            message: 'Bookmark removed'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// ================= GET MY BOOKMARKS =================

exports.getMyBookmarks = async (req, res) => {

    try {

        const bookmarks = await Bookmark.find({
            attendee: req.user.id
        })
        .populate('expo')
        .populate('session');

        res.json(bookmarks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// ================= CHECK BOOKMARK =================

exports.checkBookmark = async (req, res) => {

    try {

        const bookmark = await Bookmark.findOne({
            attendee: req.user.id,
            session: req.params.sessionId
        });

        res.json({
            bookmarked: !!bookmark
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};