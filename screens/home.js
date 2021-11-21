import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';
import { colors } from '../presets';

export default function Create() {
	let authorized

	const user = firebase.auth().currentUser;
	const userRef = firebase.firestore().collection('users').doc(user.uid);
	const createPost = () => {
		userRef.get().then((doc) => {
			if (doc.exists) {
				authorized = doc.get('authorized');
				if (authorized == false) {
					showMessage({
						message: 'you are not authorized yet',
						type: 'danger'
					});
				} else {
				<UserApproval/>	
				}
			} else {
				showMessage({
					message: 'Document doesnt exist',
					type: 'warning'
				});
			}
		});
	};

	const UserApproval = () => {
		return (
			<View>
				<View
					style={{
						marginBottom: 40,
						borderRadius: 20,
						elevation: 1,
						padding: 30,
						backgroundColor: colors.white,
						borderColor: colors.grey,
						borderWidth: 0.4
					}}
				>
					<Text style = {{color: colors.black}}>{authorized}</Text>
				<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
					<TouchableOpacity style={{ width: '50%', backgroundColor: colors.green, paddingVertical: 14 }}>
						<Text style={{ textAlign: 'center' }}>Approve</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{ width: '50%', backgroundColor: colors.red, paddingVertical: 14 }}>
						<Text style={{ textAlign: 'center' }}>Reject</Text>
					</TouchableOpacity>
				</View>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
			<ScrollView>
				<UserApproval />
				<Button title="Create" onPress={createPost} />
				<Button
					title="SignOut"
					onPress={() => {
						firebase.auth().signOut();
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
