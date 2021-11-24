import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../presets';

const Button = ({ title, onPress, disabled }) => {
	return (
		<TouchableOpacity disabled={disabled} style={[styles.button, disabled && {backgroundColor: colors.grey}]} onPress={onPress}>
			<Text style={{color: disabled ? colors.white : colors.black, textAlign: 'center'}}>{title}</Text>
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		height: 50,
		width: 160,
		borderRadius: 20,
		marginTop: 30,
		marginBottom: 20,
		backgroundColor: '#ffe699',
		alignSelf: 'center',
		justifyContent: 'center'
	},
});
