import React from 'react';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';

const user = firebase.auth().currentUser;
const userRef = firebase.firestore().collection('users');

export default function Create() {
	const createPost = () => {
		if (userRef.where('authorised', '==', false)) {
			showMessage({
				message: 'Not authorised',
				description: 'Sorry, you need to be authorised in order to create posts'
			});
		}
	};

	return (
		<SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
			<Input placeholder="create your post here..." textTitle="Create post" />
			<Button title="Create" onPress={createPost} />
		</SafeAreaView>
	);
}
