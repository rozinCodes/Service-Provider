import LottieView from 'lottie-react-native';
import React  from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Cart = () => {

	const cart = []

	if(cart.length === 0) {
		return (
		<SafeAreaView style={{ flex: 1 }}>
			<LottieView style={{ marginTop: 35 }} source={require('../assets/empty-cart.json')} autoPlay loop={false} />
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
