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
			setLoading(true);
			firebase
				.auth()
				.signInWithEmailAndPassword(values.email, values.password)
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
		<SafeAreaView style={{ flexDirection: 'column', marginHorizontal: 20 }}>
			<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

			{/* <ScrollView showsVerticalScrollIndicator={false}> */}
				<Header title="Login" />
				<Image
					style={{ height: 250, width: 350, alignSelf: 'center', marginBottom: 30 }}
					source={require('../assets//images/login.png')}
				/>
				<Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
					MANAGE ALL YOUR EMPLOYEES
				</Text>
				<Input
					placeholder="Enter your email"
					textTitle="Email"
					textTitleColor={formik.errors.email && formik.touched.email && '#D16969'}
					borderColor={formik.errors.email && formik.touched.email && '#D16969'}
					onchangeText={formik.handleChange('email')}
					customStyle={{ borderBottomWidth: 0 }}
					onBlur={formik.handleBlur('email')}
				/>
				{formik.errors.email && formik.touched.email && <Text style={{ color: '#D16969', marginTop: 8 }}>{formik.errors.email}</Text>}
				<Input
					placeholder="Enter your password"
					textTitle="Password"
					textTitleColor={formik.errors.password && formik.touched.password && '#D16969'}
					borderColor={formik.errors.password && formik.touched.password && '#D16969'}
					onchangeText={formik.handleChange('password')}
					customStyle={{
						borderBottomWidth: 0
					}}
					secureInput
					onBlur={formik.handleBlur('password')}
				/>
				{formik.errors.password && formik.touched.password &&
					<Text style={{ color: '#D16969', marginTop: 8 }}>{formik.errors.password}</Text>
				}
				<Text style = {{color: colors.grey, marginTop: 12, fontSize: 12}}>
					* Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character
				</Text>
				{loading ? (
					<LottieView
						style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
						source={require('../assets/loading.json')}
						autoPlay={true}
					/>
				) : (
					<Button disabled={!(formik.isValid && formik.dirty)}
					onPress={formik.handleSubmit} title="Submit" />
				)}
				<Text style={{ alignSelf: 'center', marginVertical: 10 }}>
					Don't have an account?{' '}
					<Text onPress={() => navigation.navigate('SignUp')} style={{ color: 'dodgerblue' }}>
						{' '}
						Sign up
					</Text>
				</Text>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default Login;
