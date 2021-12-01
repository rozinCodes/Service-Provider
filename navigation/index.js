import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Ionicons, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { firebase } from '../components/configuration/config';
import { colors } from '../presets/colors';
import Login from '../screens/login';
import SignUp from '../screens/signup';
import Cart from '../screens/cart';
import SoundBox from '../screens/soundbox';
import Earphone from '../screens/earphone';
import Headphone from '../screens/headphone';
import ProductDetails from '../screens/product-details';
import Checkout from '../screens/checkout';
import { Dimensions, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from '../screens/profile';
import { Onboarding } from '../screens/onboarding';
import Create from '../screens/create';
import Home from '../screens/home';


const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator();

const THEME = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: colors.white
	}
};
LogBox.ignoreLogs(["Setting a timer"])

const Navigation = () => {
	const [ user, setUser ] = React.useState(false);
	const [ loading, setLoading ] = React.useState(true);

	function userStateChanged(user) {
		setUser(user);
		setLoading(false);
	}

	React.useEffect(() => {
		const subscribe = firebase.auth().onAuthStateChanged(userStateChanged);
		return subscribe;
	}, []);

	if (loading) {
		return (
			<LottieView
				style={{flex: 1, width: Dimensions.get('window').height/4 }}
				resizeMode='contain'
				source={require('../assets/loading.json')}
				autoPlay={true}
			/>
		);
	}

	return (
		<NavigationContainer theme={THEME}>
			{user ? (
				<BottomTabNavigator />
			) : (
				<stack.Navigator>
					<stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
					<stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
				</stack.Navigator>
			)}
		</NavigationContainer>
	);
};

function BottomTabNavigator() {
	return (
		<Tab.Navigator initialRouteName="Home " screenOptions={{ tabBarActiveTintColor: colors.primary }}>
			<Tab.Screen
				name="Home"
				component={HomeStackScreen}
				options={{
					headerTitleAlign: 'center',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcons fontFamily="Ionicons" name={focused ? 'home' : 'home-outline'} color={color} />
					)
				}}
			/>
			<Tab.Screen
				name="Headphone"
				component={HeadphoneScreen}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcons fontFamily="Fontiso" name="headphone" color={color} />
				}}
			/>
			<Tab.Screen
				name="Soundbox"
				component={SoundboxScreen}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcons fontFamily="MaterialCommunityIcons" name="boombox" color={color} />
					)
				}}
			/>
			<Tab.Screen
				name="Earphone"
				component={EarphoneScreen}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcons fontFamily="MaterialCommunityIcons" name="headphones" color={color} />
					)
				}}
			/>
			<Tab.Screen
				name="Cart"
				component={CartScreen}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcons fontFamily="MaterialCommunityIcons" name="cart" color={color} />
					)
				}}
			/>
		</Tab.Navigator>
	);
}

function TabBarIcons({ fontFamily, color, name }) {
	if (fontFamily === 'Ionicons') {
		return <Ionicons name={name} color={color} size={18} />;
	} else if (fontFamily === 'MaterialCommunityIcons') {
		return <MaterialCommunityIcons name={name} size={18} color={color} />;
	} else if (fontFamily === 'Fontiso') {
		return <Fontisto name={name} size={18} color={color} />;
	}
}

function HomeStackScreen() {
	return (
		<stack.Navigator screenOptions={{ headerShown: false }}>
			<stack.Screen name="Home" component={Home} />
			<stack.Screen name="Create" component={Create} />
		</stack.Navigator>
	);
}
function HeadphoneScreen() {
	return (
		<stack.Navigator screenOptions={{ headerShown: false }}>
			<stack.Screen name="Headphone " component={Headphone} />
			<stack.Screen name="ProductDetails" component={ProductDetails} />
		</stack.Navigator>
	);
}
function SoundboxScreen() {
	return (
		<stack.Navigator screenOptions={{ headerShown: false }}>
			<stack.Screen name="Earphone " component={SoundBox} />
			<stack.Screen name="ProductDetails" component={ProductDetails} />
		</stack.Navigator>
	);
}
function EarphoneScreen() {
	return (
		<stack.Navigator screenOptions={{ headerShown: false }}>
			<stack.Screen name="Soundbox " component={Earphone} />
			<stack.Screen name="ProductDetails" component={ProductDetails} />
		</stack.Navigator>
	);
}
function CartScreen() {
	return (
		<stack.Navigator screenOptions={{ headerShown: false }}>
			<stack.Screen name="Cart " component={Cart} />
			<stack.Screen name="Checkout" component={Checkout} />
		</stack.Navigator>
	);
}

export default Navigation;
