import firebase from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function SignIn(props: { app: firebase.FirebaseApp }) {
	async function signInWithGoogle() {
		const auth = getAuth(props.app);
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	}

	return (
		<button className="sign-in" onClick={signInWithGoogle}>
			Sign in with Google
		</button>
	);
}

export default SignIn;
