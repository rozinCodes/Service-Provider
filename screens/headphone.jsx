import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Banner from '../components/banner'

const Headphone = () => {
    return (
        <SafeAreaView>
        <ScrollView>
            <Banner/>
        </ScrollView>
    </SafeAreaView>
    )
}

export default Headphone
