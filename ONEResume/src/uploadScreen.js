import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView}from 'react-native';
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
            const response = await fetch('https://harmony-llm-api-dev.fly.dev/anthropic/pdf/inquiry', { 
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
           const parsedData = JSON.parse(jsonResponse);

          if (parsedData && parsedData.content && Array.isArray(parsedData.content) && parsedData.content.length > 0) {
            const message = parsedData.content[0].text;
            console.log('Recommendations:', message);
            setResponseMessage(message);
        } else {
            console.log('Content is not an array or is empty', jsonResponse);
        }
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
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={uploadFile}>
                    <Text style={styles.buttonText}>Upload Resume</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollContainer}>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',  // Background color for the entire screen
    },
    header: {
        padding: 10,  // Add padding for spacing around the button
        backgroundColor: '#404040',  // Background color for the header
    },
    button: {
        padding: 10,
        alignItems: 'center',  // Center button text horizontally
        justifyContent: 'center',  // Center button text vertically
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: '#404040',

    },
    buttonText: {
        color: '#ffffff',  // Button text color
        fontSize: 16,  // Button text font size
    },
    scrollContainer: {
        flex: 1,  // Take up remaining space
    },
    progressContainer: {
        padding: 20,  // Padding around progress bar and text
        alignItems: 'center',  // Center horizontally in the container
    },
    progressText: {
        color: '#000000',  // Text color for the progress status
        fontSize: 14,  // Font size for the progress status
        marginBottom: 10,  // Space below the progress status text
    },
    messageContainer: {
        padding: 20,  // Padding around the message text
    },
    messageText: {
        color: '#333333',  // Text color for the message
        fontSize: 14,  // Font size for the message
        textAlign: 'justify',  // Justify text for better readability
    },
});


export default UploadScreen;
