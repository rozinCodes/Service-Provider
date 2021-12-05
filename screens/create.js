
import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import MapView, { Callout, Marker, AnimatedRegion } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { colors } from '../presets';



const Create = ({ navigation }) => {
	const [name, setName] = React.useState('');
	const [age, setAge] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [region, setRegion] = React.useState({
		latitude: 24.78825,
		longitude: 90.4324,
		latitudeDelta: 0.0422,
		longitudeDelta: 0.0121,
	});
	const [errorMsg, setErrorMsg] = React.useState(null);

	React.useEffect(() => {
		setLoading(true);
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setRegion(location)
			setLoading(false);
		})();
	}, []);

	//create employee data
	function createData() {
		setLoading(true);
		const user = firebase.auth().currentUser;
		if (name != '' && age != '' && gender != null) {
			const employeeData = {
				userId: user.uid,
				name,
			};
			const usersRef = firebase.firestore().collection('employees');

			usersRef.add(employeeData);
			// show success message
			showMessage({
				message: 'Success',
				description: 'Your data has been saved!',
				type: 'success'
			});
			setLoading(false);
			navigation.navigate('Home');
		} else {
			showMessage({
				message: 'please fill the required fields',
				type: 'warning',
				position: 'bottom'
			});
			setLoading(false);
		}
	}

	return (
		<SafeAreaView>
			{(region == (null || 'undefined')) ? <ActivityIndicator />
				: <ScrollView style={{
					marginHorizontal: 20
				}}>
					<Input
						onchangeText={(text) => setName(text)}
						placeholder="Your name"
						customStyle={{ borderBottomWidth: 0 }}
					/>
					<Input
						onchangeText={(text) => setAge(text)}
						placeholder="Your age"
						customStyle={{ borderBottomWidth: 0 }}
					/>
					<View style={styles.container}>

						<MapView
						provider= "google"
							
							initialRegion={region}
							zoomEnabled={true}
							showsUserLocation={true}
							provider='google'
							style={styles.map} >
							<Marker coordinate={{longitude: region.longitude, latitude: region.latitude}}
								draggable={true}
								onDragEnd={(e) => {
									setRegion({
										latitude: e.nativeEvent.coordinate.latitude,
										longitude: e.nativeEvent.coordinate.longitude
									})
								}}
							>
								<Callout>
									<Text>Current Location</Text>
								</Callout>
							</Marker>
						</MapView>
					</View>

				</ScrollView>
				// <Button title="Create" onPress={() => { }} />
			}
		</SafeAreaView>
	);
};

export default Create;


const styles = StyleSheet.create({
	container: {
		height: 200,
		width: '100%',
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
});