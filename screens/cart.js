import LottieView from 'lottie-react-native';
import React  from 'react';
import { Dimensions, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../presets';

const Cart = () => {
	const height = Dimensions.get('window').height

	const cart = []

	if(cart.length === 0) {
		return (
		<SafeAreaView style = {{flexDirection: 'column'}}>
			<View style = {{ alignItems: 'center', marginTop: height/4}}>
			<LottieView style = {{height: height/4 }} source={require('../assets/empty-cart.json')} autoPlay loop={false} />
			<Text style = {{marginTop: spacing[8], fontWeight: 'bold', fontSize: 16}}>Oops! your cart is empty</Text>
			</View>
		</SafeAreaView>
		)
	}
	return (
		<SafeAreaView>
			<Text>Something</Text>
		</SafeAreaView>
	);
};

export default Cart;
