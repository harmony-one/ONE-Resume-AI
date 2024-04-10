import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar}from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFilePicker } from 'use-file-picker';

const UploadScreen = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const navigation = useNavigation();
    const { openFilePicker, filesContent, loading } = useFilePicker({
        accept: '.pdf',
    });

    useEffect(() => {
        if(filesContent) {

        }
    }, [filesContent]);

    const uploadFile = async () => {
        if(!filesContent) {
            console.error('Missing filesContent, exit')
            return false
        }
        try {
            setUploading(true);
            setUploadProgress(0);
            setResponseMessage('');  // Reset message on new upload
            const formData = new FormData();
            formData.append('pdf', {
                uri: filesContent[0].uri,
                type: filesContent[0].type,
                name: filesContent[0].name,
            });
            formData.append('model', 'claude-3-haiku-20240307');
            formData.append('jobDescription', 'Project managers are responsible for planning and overseeing projects to ensure they are completed on time and within budget. They identify the projects goals, objectives, and scope, and create a project plan that outlines the tasks, timelines, and resources required. They also communicate with the project team and stakeholders, manage risks and issues, and monitor progress');
            formData.append('maxTokens', '1024');
            const response = await fetch('https://harmony-llm-api-dev.fly.dev/anthropic/cv/analyze', {
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
            console.log('jsonResponse:', jsonResponse);
            //  const parsedData = JSON.parse(jsonResponse);
            setResponseMessage(jsonResponse);

            //   if (parsedData && parsedData.content && Array.isArray(parsedData.content) && parsedData.content.length > 0) {
            //     const message = parsedData.content[0].text;
            //     console.log('Recommendations:', message);
            //     setResponseMessage(message);
            // } else {
            //     console.log('Content is not an array or is empty', jsonResponse);
            // }
        } catch (err) {
            console.error('Failed to upload file:', e)
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <StatusBar hidden={true} />
                <TouchableOpacity style={styles.button} onPress={() => {
                    openFilePicker()
                }}>
                    <Text style={styles.buttonText}>Upload Resume</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollContainer}>
                {uploading && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>Uploading...</Text>
                        {/*<Progress.Bar progress={uploadProgress} width={200} />*/}
                    </View>
                )}
                {responseMessage && (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{responseMessage}</Text>
                    </View>
                )}
            </ScrollView>
            <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('FileChatScreen')}>
                <Text style={styles.chatButtonText}>Chat with Us</Text>
            </TouchableOpacity>
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
    chatButton: {
        padding: 10,
        backgroundColor: '#0088cc',  // Adjust the color to match your theme
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});


export default UploadScreen;


