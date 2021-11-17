import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { colors, spacing } from '../presets';

const Banner = () => {
	return (
		<View style={[styles.Container, {borderBottomWidth: 0.5, borderBottomColor: colors.white}]}>
			<Image source={require('../assets/images/audiophile.png')} />
		</View>
	);
};

export default Banner;

const styles = StyleSheet.create({
	Container: {
		height: 60,
		backgroundColor: colors.black,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
