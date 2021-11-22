import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, ScrollView, Text } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import { Header } from '../components/header';
import Input from '../components/input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { colors } from '../presets';
import Onboarding from './onboarding';

const Login = ({ navigation }) => {
	const [ loading, setLoading ] = React.useState(false);

	const schema = Yup.object().shape({
		email: Yup.string().trim().required('Please enter your email').email('Please enter a valid email'),
		password: Yup.string()
			.required('Please Enter your password')
			.matches(/^(?=.{8,})/,'Must Contain 8 Characters')
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema: schema,
		onSubmit: (values) => {
			const email = values.email.trim()
			const password = values.password.trim()
			setLoading(true);
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then(() => {
					setLoading(false);
					navigation.navigate('Profile');
				})
				.catch((err) => {
					showMessage({
						message: 'Error',
						description: err.message,
						type: 'danger'
					});
					setLoading(false);
				});
			setLoading(false);
		}
	});

	return (
		<Onboarding/>
	);
};

export default Login;
