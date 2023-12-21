const Blog = require("../module/schema").Blog;
const PostComments = require("../module/schema").PostComments;

const NodeCache = require("node-cache");
const myCache = new NodeCache();

async function getBlogPosts() {
  try {
    const cachedBlogPosts = myCache.get("cachedBlogPosts");

    if (cachedBlogPosts) {
      return cachedBlogPosts;
    } else {
      const blogPosts = await Blog.find({});
      myCache.set("cachedBlogPosts", blogPosts, 3600);

      return blogPosts;
    }
  } catch (e) {
    throw e;
  }
}
async function postComment(req, res) {
  var commentorId = "anonymous";
  var userDetails = {
    profilePicture: {
      originalname: "anonymous.png",
    },
  };
  if (req.isAuthenticated()) {
    profilePicture = req.user.profilePicture;
    userDetails = req.user;
  } else if (req.session.adminIsAuthorised === true) {
    userDetails = adminDetails;
    commentorId = req.session.adminId;
  } else if (req.session.teacherIsAuthorised === true) {
    userDetails = await teacherModel.findById(req.session.teacherId);
    commentorId = req.session.teacherId;
  } else {
    userDetails = {
      name: req.body.name,
      profilePicture: {
        originalname: "anonymous.png",
      },
    };
  }
  const newComment = new PostComments({
    commenterId: commentorId,
    postId: req.params.id,
    name: req.body.name,
    userDetails: userDetails,
    comment: req.body.comment,
    commentCount: (await PostComments.find({})).length,
  });

  console.log(newComment);
  await newComment.save();
}

async function makePost(req, res) {
  const newPost = new Blog({
    postCount: (await Blog.find({})).length,
    title: req.body.title,
    description: req.body.description,
    thumbnail: req.file,
    authourId: req.session.teacherId || req.session.adminDetails,
    post: req.body.post,
  });
  await newPost.save();
  console.log(newPost);
}

async function deletePost(req, res) {
  await Blog.findByIdAndDelete(req.params.id);
}
module.exports = { getBlogPosts, postComment, makePost, deletePost };
