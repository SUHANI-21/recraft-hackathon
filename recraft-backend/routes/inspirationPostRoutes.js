import express from 'express';
const router = express.Router();
import { getPosts, createPost, updatePost, deletePost, getPostById, getMyPosts } from '../controllers/inspirationPostController.js';
import { protect } from '../middleware/authMiddleware.js'; // We only need `protect`
// ... (imports)


// GET all posts is public
router.route('/').get(getPosts)
  // POST (create) a post requires a user to be logged in
  .post(protect, createPost);
  router.route('/myposts').get(protect, getMyPosts); 

// To Update or Delete a post, you must be logged in
router.route('/:id')
  .get(getPostById) // <-- ADD THIS
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;