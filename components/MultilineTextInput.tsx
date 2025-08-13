import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions } from 'react-native';

type Props = {
  post: string;
  title: string;
  setPost: (value: any) => void;
  maxLength: number;//максимальная длина текста в textInput
  warningLength: number;//длина текста в textInput, при которой появляется предупреждение
  editable: boolean;
};

export default function MultilineTextInput({
  post,
  setPost,
  maxLength,
  warningLength,
  title,
  editable
}: Props) {

    const [inputHeight, setInputHeight] = useState(42);
    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

      return (
        <>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>{title}</Text>
                  
          <TextInput
            style={[styles.input, { 
                fontSize: ts(14),
                minHeight: 42, // минимальная высота
                //maxHeight: 100, // максимальная высота (можно увеличить при необходимости)
                height: inputHeight, // динамическая высота
                lineHeight: ts(22),
                alignContent: 'center',
                textAlignVertical: 'center'
            }]}
            maxLength={maxLength}
            placeholderTextColor="#111"
            value={post}
            onChangeText={setPost}
            multiline
            editable={editable}
            onContentSizeChange={(e) => {
               let inputH = Math.max(e.nativeEvent.contentSize.height, 35)
              if(inputH>maxLength) inputH =maxLength
              setInputHeight(inputH)
            }}
            />
            {post.length >=warningLength? 
                        <Text style={{ fontSize: ts(11),  color: '#B3B3B3', fontWeight: '400', marginTop: -14.6, marginBottom: 16}}>
                          Можете ввести еще {maxLength-post.length}{' '}
                          {(maxLength-post.length) % 10 === 1? <Text>символ</Text>
                          : (maxLength-post.length) % 10 === 2 || (maxLength-post.length) % 10 === 3 || (maxLength-post.length) % 10 === 4? <Text>символа</Text>
                          : <Text>символов</Text>}
                        </Text>
                      : '' }
            </>
          );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '100%',
    height: 42,
    paddingVertical: 'auto',
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 20,
  },
});
