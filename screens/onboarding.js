import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { colors } from '../presets';
import Login from './login';
import SignUp from './signup';

export const Onboarding = () => {
	return (
		<View style={styles.container}>
			<StatusBar hidden={true} />
			<Swiper
				loop={false}
				activeDotStyle={{ backgroundColor: colors.blue }}
				dotStyle={{ backgroundColor: colors.white, borderColor: colors.blue, borderWidth: 0.5 }}
				paginationStyle={{
					marginBottom: 620,
					marginRight: 320
				}}
				autoplay={false}
			>
				<Login />
				<SignUp />
			</Swiper>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
