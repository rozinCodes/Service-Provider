import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Banner from '../components/banner';
import Button from '../components/button';
import { spacing } from '../presets';
import { colors } from '../presets/colors';
import { firebase } from '../components/configuration/config'


const Home = () => {
	return (
		<SafeAreaView>
			<ScrollView>
				<Banner />
				<View style={{ alignItems: 'center' }}>
					<View style={{ position: 'absolute', top: 200, alignItems: 'center' }}>
						<Text
							style={{
								color: colors.white,
								marginBottom: spacing[2],
								fontSize: spacing[6],
								textTransform: 'uppercase',
								fontWeight: 'bold'
							}}
						>
							Welcome
						</Text>
						<Text style={{ color: colors.white, width: 250, textAlign: 'center', lineHeight: spacing[5] }}>
							Experience natural, lifelike audio and exceptional build quality made for the passionate
							music enthusiast.
						</Text>
					</View>
					<Button title = "SignOut" onPress = {() => {firebase.auth().signOut()}}/>
					{/* <LottieView
						style={{ flex: 1, width: Dimensions.get('window').height / 4, backgroundColor: colors.black }}
						resizeMode="contain"
						source={require('../assets/arrow-down.json')}
						autoPlay={true}
					/> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
