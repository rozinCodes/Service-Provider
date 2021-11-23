import React from 'react';
import LottieView from 'lottie-react-native';
import { ScrollView, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import { Header } from '../components/header';
import Input from '../components/input';
import RadioInput from '../components/radioInput';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../presets';
// import { useDispatch, useSelector } from 'react-redux';
// import { userSelector } from '../redux/userSlice';

const SignUp = () => {
	const OPTIONS = [ 'Male', 'Female', 'Non-binary' ];

	const [ gender, setGender ] = React.useState(null);
	const [ loading, setLoading ] = React.useState(false);
	const [visible, setVisible] = React.useState(true)

	const schema = Yup.object().shape({
		email: Yup.string().trim().required('Please enter your email').email('Please enter a valid email'),
		password: Yup.string()
			.required('Please Enter your password')
			.matches(/^(?=.{8,})/, 'Must Contain at least 8 Characters')
			.matches(/^(?=.*[0-9])/, 'Password must contain at least one number')
			.matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
			.matches(/^(?=.*[A-Z])/, 'Password must contain one upper case letter')
			.matches(/^(?=.*[!@#\$%\^&\*])/, 'Password must be contain at least one special character'),
		confirm: Yup.string()
			.oneOf([ Yup.ref('password'), null ], 'Passwords do not match')
			.required('Please confirm your password')
	});
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			confirm: ''
		},
		validationSchema: schema,
		onSubmit: (values) => {
			const email = values.email.trim();
			const password = values.password.trim();
			setLoading(true);
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((response) => {
					const uid = response.user.uid;
					const authorized = false

					const profileData = {
						id: uid,
						email,
						gender,
						authorized
					};
					const usersRef = firebase.firestore().collection('users');

					usersRef.doc(uid).set(profileData);
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
				<Header backButton={true} title="Sign Up" />
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
						textTitle="Email"
						placeholder="Enter your email"
						textTitleColor={formik.errors.email && formik.touched.email && '#D16969'}
						borderColor={formik.errors.email && formik.touched.email && '#D16969'}
						borderWidth={formik.errors.email && formik.touched.email && 2}
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
						textTitleColor={formik.errors.password && formik.touched.password && '#D16969'}
						borderColor={formik.errors.password && formik.touched.password && '#D16969'}
						borderWidth={formik.errors.password && formik.touched.password && 2}
						secureIcon
						onchangeText={formik.handleChange('password')}
						customStyle={{
							borderBottomWidth: 0
						}}
						secureInput={visible}
						onPress={() => setVisible(!visible)}
						onBlur={formik.handleBlur('password')}
					/>
					{formik.errors.password &&
					formik.touched.password && (
						<Text style={{ color: '#D16969', marginTop: 8 }}>{formik.errors.password}</Text>
					)}
					<Text style={{ color: colors.grey, marginTop: 12, fontSize: 12, fontWeight: 'bold' }}>
						* Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and One Special
						Case Character e.g - @iHateMyself1
					</Text>
					<Input
						placeholder="Confirm your password"
						textTitle="Confirm password"
						textTitleColor={formik.errors.confirm && formik.touched.confirm && '#D16969'}
						borderColor={formik.errors.confirm && formik.touched.confirm && '#D16969'}
						borderWidth={formik.errors.confirm && formik.touched.confirm && 2}
						onchangeText={formik.handleChange('confirm')}
						customStyle={{
							borderBottomWidth: 0
						}}
						secureInput
						onBlur={formik.handleBlur('confirm')}
					/>
					{formik.errors.confirm &&
					formik.touched.confirm && (
						<Text style={{ color: '#D16969', marginTop: 8 }}>{formik.errors.confirm}</Text>
					)}
				</View>

				{/* mapping gender values */}
				{OPTIONS.map((options, index) => (
					<RadioInput key={index} title={options} value={gender} setValue={setGender} />
				))}
				{loading ? (
					<LottieView
						style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
						source={require('../assets/loading.json')}
						autoPlay={true}
					/>
				) : (
					<Button disabled={!(formik.isValid && formik.dirty && gender != null)} onPress={formik.handleSubmit} title="Submit" />
				)}

				<Text style={{ alignSelf: 'center', fontSize: 12 }}>
					By continuing you accept the <Text style={{ color: 'dodgerblue' }}> Terms of use</Text>
					<Text> and </Text>
					<Text style={{ color: 'dodgerblue' }}> Privacy policy</Text>
				</Text>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default SignUp;
