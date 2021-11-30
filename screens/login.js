import { useFormik } from 'formik';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';

const Login = ({ navigation }) => {
	const [ loading, setLoading ] = React.useState(false);
	const [ visible, setVisible ] = React.useState(true);

	const schema = Yup.object().shape({
		email: Yup.string().trim().required('Please enter your email').email('Please enter a valid email'),
		password: Yup.string().required('Please Enter your password').matches(/^(?=.{8,})/, 'Must Contain 8 Characters')
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema: schema,
		onSubmit: (values) => {
			const email = values.email.trim();
			const password = values.password.trim();
			setLoading(true);
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then(() => {
					setLoading(false);
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
	const emailError = formik.errors.email && formik.touched.email;
	const passwordError = formik.errors.password && formik.touched.password;

	return (
		<SafeAreaView>
			<KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
				<View
					style={{
						marginTop: 130,
						justifyContent: 'center',
						marginBottom: 20,
						marginHorizontal: 20
					}}
				>
					<Text style={{ fontWeight: 'bold', fontSize: 18 }}>Login</Text>
					<Input
						placeholder="Enter your email"
						textTitle="Email"
						textTitleColor={emailError && '#D16969'}
						borderColor={emailError && '#D16969'}
						borderWidth={emailError && 2}
						onchangeText={formik.handleChange('email')}
						customStyle={{ borderBottomWidth: 0 }}
						onBlur={formik.handleBlur('email')}
					/>
					{formik.errors.email &&
					formik.touched.email && (
						<Text style={{ color: '#D16969', marginTop: 8 }}>{formik.errors.email}</Text>
					)}
					<Input
						placeholder="Enter your password"
						textTitle="Password"
						textTitleColor={passwordError && '#D16969'}
						borderColor={passwordError && '#D16969'}
						borderWidth={passwordError && 2}
						onchangeText={formik.handleChange('password')}
						customStyle={{
							borderBottomWidth: 0
						}}
						secureIcon
						secureInput={visible}
						secureInput={visible}
						onPress={() => setVisible(!visible)}
						onBlur={formik.handleBlur('password')}
					/>
					{formik.errors.password &&
					formik.touched.password && (
						<Text style={{ color: '#D16969', marginTop: 8 }}>{formik.errors.password}</Text>
					)}
					{loading ? (
						<LottieView
							style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
							source={require('../assets/loading.json')}
							autoPlay={true}
						/>
					) : (
						<Button
							disabled={!(formik.isValid && formik.dirty)}
							onPress={formik.handleSubmit}
							title="Submit"
						/>
					)}
					<Text style={{ alignSelf: 'center', marginVertical: 10 }}>
						Don't have an account?{' '}
						<Text onPress={() => navigation.navigate('SignUp')} style={{ color: 'dodgerblue' }}>
							{' '}
							Sign up
						</Text>
					</Text>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default Login;
