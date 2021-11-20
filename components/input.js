import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

const Input = ({
	placeholder,
	value,
	onchangeText,
	customStyle,
	secureInput = false,
	textTitle,
	optionalText,
	onBlur,
	textTitleColor = 'black',
	borderColor = 'grey'
}) => {
	return (
		<View style={{ flexDirection: 'column', marginTop: 40 }}>
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
			{optionalText && (
				<Text
					style={{
						fontSize: 12,
						marginBottom: 14,
						marginLeft: 4,
						color: 'grey'
					}}
				>
					{optionalText}
				</Text>
			)}

			<View
				style={{
					borderWidth: 1,
					paddingVertical: 10,
					justifyContent: 'center',
					alignItems: 'center',
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
					to
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
		width: '100%',
		height: '100%'
	}
});
