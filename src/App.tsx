import './styles.css';
import JumperList from './JumperList';
import LoadContainer from './LoadContainer';
import { Helmet } from 'react-helmet';
import HeaderNavBar from './HeaderNavBar';
import FooterNavBar from './FooterNavBar';

function App() {
	return (
		<div className="App">
			<Helmet>
				<script src="https://kit.fontawesome.com/4ae8208dc5.js"></script>
			</Helmet>
			<header className="App-header"></header>
			<HeaderNavBar />
			<LoadContainer />
			<JumperList />
			<FooterNavBar />
		</div>
	);
}

export default App;
