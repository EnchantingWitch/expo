/*import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'

import { useLocalSearchParams } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite'
import { searchPosts } from '../../lib/appwrite'
import Search_Input from '@/components/Search_Input';

const Search = () => {
    const { query } = useLocalSearchParams();
    const { data: posts, refetch } = useAppwrite(
        () => searchPosts(query)
    );

    useEffect(() => {
        refetch()
    }, [query])

    return (
        <SafeAreaView>
            <Text>{query}</Text>
            <View>
                <Search_Input initialQuery={query} />
            </View>
        </SafeAreaView>
    )
}

export default Search
*/