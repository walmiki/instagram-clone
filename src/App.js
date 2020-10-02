import React, { useEffect, useState } from "react";
import "./App.css";
import InstagramEmbed from "react-instagram-embed";
import { db, auth } from "./firebase";

import Post from "./components/Post";
import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [modalStyle] = useState(getModalStyle);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [openSignIn, SetOpenSignIn] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				setUser(authUser);

				if (authUser.displayName) {
				} else {
					return authUser.updateProfile({
						displayName: username,
					});
				}
			} else {
				setUser(null);
			}
		});
		return () => {
			unsubscribe();
		};
	}, [user, username]);
	useEffect(() => {
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setPosts(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						post: doc.data(),
					}))
				);
			});
	}, []);

	const signUp = (e) => {
		e.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.catch((e) => alert(e.message))
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			});
		setOpen(false);
	};

	const signIn = (e) => {
		e.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((e) => alert(e.message));
		SetOpenSignIn(false);
	};

	return (
		<div className="App">
			<Modal className="app__modal" open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signUp">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="Username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							placeholder="Email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="Set Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>

			<Modal
				className="app__modal"
				open={openSignIn}
				onClose={() => SetOpenSignIn(false)}
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signUp">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="Email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="Set Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>
			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt="instagram-logo"
				/>
				{user ? (
					<Button onClick={() => auth.signOut()}>Sign Out</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => SetOpenSignIn(true)}>Sign In</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</div>
			<div className="app__post">
				<div className="app__postLeft">
					{posts.map(({ id, post }) => (
						<Post
							key={id}
							postId={id}
							user={user}
							username={post.username}
							caption={post.caption}
							imageUrl={post.imageUrl}
						/>
					))}
				</div>

				<div className="app__postRight">
					<InstagramEmbed
						url="https://www.instagram.com/p/Bt1Fak0lscD/?utm_source=ig_web_copy_link"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>
			<div className="app__imageUpload">
				{user?.displayName ? (
					<ImageUpload username={user.displayName} />
				) : (
					<h3> Sorry you need to login to upload</h3>
				)}
			</div>
		</div>
	);
}

export default App;
