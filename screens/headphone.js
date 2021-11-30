import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Banner from '../components/banner'
import Button from '../components/button'

const Headphone = ({navigation}) => {
    return (
        <SafeAreaView>
        <ScrollView>
            <Banner/>
            <Button title = "navigate" onPress = {() => navigation.navigate('ProductDetails')}/>
        </ScrollView>
    </SafeAreaView>
    )
}

export default Headphone
