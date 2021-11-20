import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useFormik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../presets';
import Button from '../components/button';
import {firebase} from '../components/configuration/config'
import { showMessage } from 'react-native-flash-message';

export default function Phone() {
	const formik = useFormik({
		initialValues: {
			phone: ''
		},
		onSubmit: async (values) => {
			console.warn(values.phone.trim());
            await firebase.auth().signInWithPhoneNumber(values.phone).then((result) => {
                    showMessage({
                        message: result,
                        type: 'success'
                    })
            }).catch((err) => {
                showMessage({
                    message: err.message,
                    type: 'danger'
                })
            })
		}
	});
	return (
		<SafeAreaView style = {{justifyContent: 'center' , alignItems: 'center', flex: 1, padding: 12}}>
			<View style = {{borderWidth: 1, borderRadius: 12, padding: 15, width: '100%'}}>
            <TextInput 
            placeholder="Enter your phone number" 
            onChangeText={formik.handleChange('phone')}
            onBlur={formik.handleBlur('phone')}
            />
            </View>
            {formik.errors.phone && formik.touched.phone (
                <Text style = {{color: colors.red}}>{formik.errors.phone}</Text>
            )}
            <Button title = "Submit" onPress = {formik.handleSubmit}/>
		</SafeAreaView>
	);
}
