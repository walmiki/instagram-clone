import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import { Button } from "@material-ui/core";
import firebase from "firebase";

const Post = ({ postId, user, username, caption, imageUrl }) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState([]);

	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}
		return () => {
			unsubscribe();
		};
	}, [postId]);

	const postComment = (e) => {
		e.preventDefault();
		db.collection("posts").doc(postId).collection("comments").add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			text: comment,
			username: user.displayName,
		});
		setComment("");
	};

	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt={username}
					src="/static/images/avatar/1.jpg"
				/>
				<h3>{username}</h3>
			</div>
			<img className="post__image" src={imageUrl} alt="post_image" />
			<p className="post__text">
				<strong>{username}</strong> {caption}
			</p>
			<div className="post__comments">
				{comments.map((comment) => (
					<p>
						<strong className="pr__2">{comment.username}</strong>
						{comment.text}
					</p>
				))}
			</div>
			{user && (
				<form className="post__commentBox">
					<input
						className="post__input"
						type="text"
						placeholder="Add a comment..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<Button
						className="post__button"
						disabled={!comment}
						type="submit"
						onClick={postComment}
					>
						Post
					</Button>
				</form>
			)}
		</div>
	);
};

export default Post;
