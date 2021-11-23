import { useFormik } from 'formik';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import { Header } from '../components/header';
import Input from '../components/input';
import { colors } from '../presets';

const Login = ({ navigation }) => {
	const [ loading, setLoading ] = React.useState(false);
	const [visible, setVisible] = React.useState(true)

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

	return (
		<SafeAreaView>
			<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
			<Header title="Login" />
				{/* <Header title="Login" />
				<Image
					style={{ height: 250, width: 350, alignSelf: 'center', marginBottom: 30 }}
					source={require('../assets//images/login.png')}
				/>
				<Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
					MANAGE ALL YOUR EMPLOYEES
				</Text> */}
				<View
					style={{
						marginTop: 20,
						justifyContent: 'center',
						marginBottom: 20,
						marginHorizontal: 20
					}}
				>
				<Text style = {{fontWeight: 'bold', fontSize: 18}}>Signup</Text>
				<Input
					placeholder="Enter your email"
					textTitle="Email"
					textTitleColor={formik.errors.email && formik.touched.email && '#D16969'}
					borderColor={formik.errors.email && formik.touched.email && '#D16969'}
					borderWidth={formik.errors.email && formik.touched.email && 2}
					onchangeText={formik.handleChange('email')}
					customStyle={{ borderBottomWidth: 0 }}
					onBlur={formik.handleBlur('email')}
				/>
				{formik.errors.email &&
				formik.touched.email && <Text style={{ color: '#D16969', marginTop: 8 }}>{formik.errors.email}</Text>}
				<Input
					placeholder="Enter your password"
					textTitle="Password"
					textTitleColor={formik.errors.password && formik.touched.password && '#D16969'}
					borderColor={formik.errors.password && formik.touched.password && '#D16969'}
					borderWidth={formik.errors.password && formik.touched.password && 2}
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
				<Text style={{ color: colors.grey, marginTop: 12, fontSize: 12 }}>
					* Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case
					Character
				</Text>
				{loading ? (
					<LottieView
						style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
						source={require('../assets/loading.json')}
						autoPlay={true}
					/>
				) : (
					<Button disabled={!(formik.isValid && formik.dirty)} onPress={formik.handleSubmit} title="Submit" />
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
