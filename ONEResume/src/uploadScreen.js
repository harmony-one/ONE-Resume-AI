import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import DocumentPicker from 'react-native-document-picker';

const UploadScreen = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const uploadFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setUploading(true);
            setUploadProgress(0);
            setResponseMessage('');  // Reset message on new upload
            const formData = new FormData();
            formData.append('pdf', {
                uri: res[0].uri,
                type: res[0].type,
                name: res[0].name,
            });
            formData.append('model', 'claude-3-haiku-20240307');
            formData.append('system', 'You are tasked with reviewing a CV and providing three concise recommendations for improvement in one paragraph. The goal is to help the CV stand out more effectively to potential employers. Specifically, focus on tailoring the CV to match job descriptions, quantifying achievements to demonstrate impact, and including relevant keywords to optimize visibility. Write a paragraph outlining these improvements, ensuring clarity and specificity in your suggestions to assist the CV owner in enhancing their document effectively.');
            formData.append('maxTokens', '1000');
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
                onUploadProgress: progressEvent => {
                    const progress = progressEvent.loaded / progressEvent.total;
                    setUploadProgress(progress);
                },
            });

            const jsonResponse = await response.json();
            console.log('Upload complete:', jsonResponse);
            setResponseMessage(jsonResponse.message);

            setUploading(false);
        } catch (err) {
            setUploading(false);
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the document picker');
            } else {
                throw err;
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={uploadFile}>
                <Text style={styles.buttonText}>Upload Resume</Text>
            </TouchableOpacity>
            {uploading && (
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Uploading...</Text>
                    <Progress.Bar progress={uploadProgress} width={200} />
                </View>
            )}
            {responseMessage && (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{responseMessage}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#404040',
    },
    button: {
        padding: 15,
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: '#404040',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    progressText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
     // Add your styles here
     messageContainer: {
        marginTop: 20,
        padding: 15,
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'white',
    },
    messageText: {
        color: 'white',
        fontSize: 16,
      //  textAlign: 'center',
    },
});

export default UploadScreen;
