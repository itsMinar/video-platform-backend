const addComment = require('./addComment.controller');
const deleteComment = require('./deleteComment.controller');
const getVideoComments = require('./getVideoComments.controller');
const updateComment = require('./updateComment.controller');

module.exports = { getVideoComments, addComment, updateComment, deleteComment };
