import { AuthenticationError, UserInputError } from "apollo-server";

import Post from '../../models/Post';
import checkAuth from "../../utils/checkAuth";

export default {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_: any, { postId }: {
            postId: any;
        }): Promise<any> {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_: any, { body }: {
            body: any;
        }, context: any): Promise<any> {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;
        },
        async deletePost(_: any, { postId }: {
            postId: any;
        }, context: any): Promise<string> {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async likePost(_: any, { postId }: {
            postId: any;
        }, context: any): Promise<any> {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find((like: any) => like.username === username)) {
                    // Post already likes, unlike it
                    post.likes = post.likes.filter((like: any) => like.username !== username);
                } else {
                    // Not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_: any, __: any, { pubsub }: {
                pubsub: any;
            }) => pubsub.asyncIterator('NEW_POST')
        }
    }
};