import InspirationPost from '../models/inspirationPostModel.js';

// @desc    Fetch all PUBLISHED inspiration posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  const posts = await InspirationPost.find({ status: 'Published' }).populate('user', 'name profileImage userType');
  res.json(posts);
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Any logged-in user can create a post)
// ... (keep the `import InspirationPost from ...` line at the top)

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Any logged-in user can create a post)
const createPost = async (req, res) => {
  // Use a try...catch block to handle any potential errors
  try {
    const { title, description, materialsUsed, photos } = req.body;

    // Add validation to ensure required fields are present
    if (!title || !description || !photos || photos.length === 0) {
      res.status(400); // Bad Request
      // This error will be caught by the catch block below
      throw new Error('Please provide a title, description, and at least one photo URL');
    }
  
    const post = new InspirationPost({
      title,
      description,
      materialsUsed,
      photos, // The photos array from the request body
      user: req.user._id, // The ID of the logged-in user from the 'protect' middleware
      status: 'Draft', // New posts are always drafts by default
    });

    const createdPost = await post.save();
    
    // On success, send back the new post data with a 201 'Created' status
    res.status(201).json(createdPost);

  } catch (error) {
    // --- THIS IS THE CRITICAL PART ---
    // If any error occurs in the 'try' block, this 'catch' block will run.
    // It guarantees that you ALWAYS send back a JSON response, never HTML.
    
    // If a status code was already set (like 400 for validation), use it. Otherwise, use a generic 500.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    
    res.status(statusCode).json({ 
      message: error.message,
      // In development, you might also want to send the error stack for easier debugging
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// ... (keep the rest of your controller functions: getPosts, updatePost, etc.)
// ... (make sure `createPost` is in your exports at the bottom of the file)

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { title, description, materialsUsed, status, photos } = req.body;
    const post = await InspirationPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Security Check: Make sure the logged-in user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized
      throw new Error('User not authorized to edit this post');
    }

    // Update only the fields that were provided in the request
    post.title = title || post.title;
    post.description = description || post.description;
    post.materialsUsed = materialsUsed || post.materialsUsed;
    post.status = status || post.status; // This allows publishing a draft
    post.photos = photos || post.photos;

    const updatedPost = await post.save();
    res.json(updatedPost);

  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};
// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await InspirationPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Security Check: Make sure the logged-in user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this post');
    }

    await post.deleteOne();
    res.json({ message: 'Post removed successfully' });

  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};
const getPostById = async (req, res) => {
    try {
        const post = await InspirationPost.findById(req.params.id).populate('user', 'name profileImage userType');
        if (post) {
            res.json(post);
        } else {
            res.status(404); throw new Error('Post not found');
        }
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};
const getMyPosts = async (req, res) => {
    const posts = await InspirationPost.find({ user: req.user._id }).populate('user', 'name profileImage userType');
    res.json(posts);
};

// @desc    Publish a draft post
// @route   PUT /api/posts/:id/publish
// @access  Private
const publishPost = async (req, res) => {
  try {
    const post = await InspirationPost.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Security Check: Make sure the logged-in user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'User not authorized to publish this post' });
      return;
    }

    // Update post status to Published
    post.status = 'Published';
    const updatedPost = await post.save();
    res.json(updatedPost);

  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await InspirationPost.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if user already liked the post
    if (post.likes.includes(req.user._id)) {
      res.status(400).json({ message: 'You already liked this post' });
      return;
    }

    // Add user to likes array
    post.likes.push(req.user._id);
    await post.save();
    res.json({ likeCount: post.likes.length });

  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Unlike a post
// @route   POST /api/posts/:id/unlike
// @access  Private
const unlikePost = async (req, res) => {
  try {
    const post = await InspirationPost.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if user liked the post
    if (!post.likes.includes(req.user._id)) {
      res.status(400).json({ message: 'You have not liked this post' });
      return;
    }

    // Remove user from likes array
    post.likes = post.likes.filter(userId => userId.toString() !== req.user._id.toString());
    await post.save();
    res.json({ likeCount: post.likes.length });

  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

export { getPosts, createPost, updatePost, deletePost, getPostById, getMyPosts, publishPost, likePost, unlikePost };


