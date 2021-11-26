import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';
import { colors } from '../presets';
import { fetchEmp, fetchProducts } from '../redux/technicialSlice';

export default function Create() {



	const user = firebase.auth().currentUser;
	const userRef = firebase.firestore().collection('users').doc(user.uid);
	let [users, setUsers] = React.useState([]);

	// React.useEffect(() => {
	// 	userRef.get().then((doc) => {
	// 		if (doc.exists) {
	// 			const authorized = doc.get('authorized');
	// 			if (authorized == false) {
	// 				showMessage({
	// 					message: 'you are not authorized yet',
	// 					type: 'danger'
	// 				});
	// 			} else {
	// 				userRef.get().then((doc) => {
	// 					if (doc.exists) {
	// 						setUsers(doc.data())
	// 					}
	// 				});
	// 			}
	// 		} else {
	// 			showMessage({
	// 				message: 'Document doesnt exist',
	// 				type: 'warning'
	// 			});
	// 		}
	// 	});
	// }, []);

	const createPost = async () => {
	 userRef.get().then((doc) => {
			if (doc.exists) {
				const authorized = doc.get('authorized');
				if (authorized == false) {
					showMessage({
						message: 'you are not authorized yet',
						type: 'danger'
					});
				} else {
				 userRef.get().then((docs) => {
						if (docs.exists) {
							users.push(doc.data());
						}
					});
				}
			} else {
				showMessage({
					message: 'Document doesnt exist',
					type: 'warning'
				});
			}
		});
	};
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(fetchProducts());
	}, []);

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
							{/* <TouchableOpacity style={{ width: '50%', backgroundColor: colors.green, paddingVertical: 6 }}>
						<Text style={{ textAlign: 'center' }}>Approve</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{ width: '50%', backgroundColor: colors.red, paddingVertical: 6 }}>
						<Text style={{ textAlign: 'center' }}>Reject</Text>
					</TouchableOpacity> */}
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
