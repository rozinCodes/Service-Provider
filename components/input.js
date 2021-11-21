import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

const Input = ({
	placeholder,
	value,
	onchangeText,
	customStyle,
	secureInput = false,
	textTitle,
	onBlur,
	borderWidth = 0.5,
	textTitleColor = 'black',
	borderColor = 'grey'
}) => {
	return (
		<View style={{ flexDirection: 'column', marginTop: 30 }}>
			<Text
				style={{
					fontSize: 12,
					marginBottom: 8,
					marginLeft: 4,
					color: textTitleColor,
					fontWeight: 'bold'
				}}
			>
				{textTitle}
			</Text>
			<View
				style={{
					borderWidth: borderWidth,
					paddingVertical: 10,
					borderColor: borderColor,
					borderRadius: 8,
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<TextInput
					autoCorrect={false}
					placeholder={placeholder}
					onChangeText={onchangeText}
					style={[ styles.input, customStyle ]}
					secureTextEntry={secureInput}
					value={value}
					onBlur={onBlur}
				/>
			</View>
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	input: {
		paddingHorizontal: 20,
		flex: 1,
	}
});
