import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, ActivityIndicator, StatusBar, KeyboardAvoidingView, ScrollView, TextInput, Keyboard } from 'react-native';
import { Bubble, GiftedChat, Send, IMessage } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import NavBar from './components/navbar';
import InChatFileTransfer from './components/InChatFileTranfer';
import InChatViewFile from './components/InChatViewFile';
import * as DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';


//Project managers are responsible for planning and overseeing projects to ensure they are completed on time and within budget. They identify the projects goals, objectives, and scope, and create a project plan that outlines the tasks, timelines, and resources required. They also communicate with the project team and stakeholders, manage risks and issues, and monitor progress

interface File extends IMessage {
    url?: string;
}

const FileChatScreen = () => {

    const [filePath, setFilePath] = useState('');
    const [uploading, setUploading] = useState(false); // State to track uploading
    const [documentName, setDocumentName] = useState('');
    const [inputText, setInputText] = useState('');
    const [nextId, setNextId] = useState(1);
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();

    const Message = ({ isUser, text }) => (
        <View style={isUser ? styles.messageTop : styles.messageTopUser} >
            <Text style={styles.userName}>{isUser ? 'You' : 'Claude 3'}</Text>
            <View style={[styles.message, isUser ? styles.userMessage : styles.botMessage]}>
                <Text style={styles.messageText}>{text}</Text>
            </View>
        </View>
    );


    // add a function attach file using DocumentPicker.pick
    const _pickDocument = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'documentDirectory',
                mode: 'import',
                allowMultiSelection: false,
            });
            const fileUri = result[0].fileCopyUri;
            setDocumentName(result[0].name); // Set the uploaded document name
            setFilePath(fileUri);
            console.log(fileUri);
            //  setUploading(true); // End upload

            // try {
            //     var name = fileUri.split('/').pop();
            //     const formData = new FormData();
            //     formData.append('pdf', {
            //         uri: fileUri,
            //         type: 'pdf',
            //         name: name.replace('%20', '').replace(' ', '')
            //     });

            //     // console.log('messageToSend.text', messageToSend.text);
            //     formData.append('model', 'claude-3-haiku-20240307');
            //     formData.append('jobDescription', "messageToSend.text");
            //     formData.append('maxTokens', '1024');
            //     const response = await fetch('API URL here', {
            //         method: 'POST',
            //         body: formData,
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //     });
            //     const jsonResponse = await response.json();
            //     console.log('jsonResponse:', jsonResponse);
            //     setUploading(false); // End upload
            //     const newMessage = {
            //         isUser: false,
            //         text: jsonResponse,
            //         id: nextId, // simple id assignment

            //     };
            //     setMessages([...messages, newMessage]);
            //     setNextId(prevId => prevId + 1);

            //   //  setFilePath('');
            //   //  setIsAttachFile(false);

            // } catch (error) {
            //     console.error('Error sending file:', error);
            //     setUploading(false); // End upload in case of error
            // }


            if (!fileUri) {
                console.log('File URI is undefined or null');
                return;
            }
            if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
                //  setImagePath(fileUri);
                // setIsAttachImage(true);
            } else {
                // setFilePath(fileUri);
                // setIsAttachFile(true);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker');
            } else {
                console.log('DocumentPicker err => ', err);
                throw err;
            }
        }
    };

    // Dummy function to remove the uploaded document
    const handleRemovePress = () => {
        setDocumentName('');
        setFilePath('');
        setMessages([]);
    };

    // Function to handle sending a message
    const handleSendMessage = async () => {
        if (!filePath) {
            Toast.show({
                type: 'error',
                text1: 'Resume missing.',
            });
            return
        }

        if (!inputText) {

            Toast.show({
                type: 'error',
                text1: 'Could you provide the job description, please?',
            });
            return

        }
        Keyboard.dismiss();

        const userMessage = {
            isUser: true,
            text: inputText,
            id: uuid.v4(), // simple id assignment

        };
        // Immediately add the user message to the messages list
        setMessages(prevMessages => [...prevMessages, userMessage]);
        try {

            setUploading(true);
            var name = filePath.split('/').pop();
            console.log('filePath:', filePath);
            const formData = new FormData();
            formData.append('pdf', {
                uri: filePath,
                type: 'pdf',
                name: name.replace('%20', '').replace(' ', '')
            });

            // console.log('messageToSend.text', messageToSend.text);
            formData.append('model', 'claude-3-haiku-20240307');
            formData.append('jobDescription', inputText);
            formData.append('maxTokens', '1024');
            const response = await fetch('API URL Here', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const jsonResponse = await response.json();
            console.log('jsonResponse:', jsonResponse);
            setUploading(false); // End upload
            const newMessage = {
                isUser: false,
                text: jsonResponse,
                id: uuid.v4() // simple id assignment

            };
            // Immediately add the user message to the messages list
            setMessages(prevMessages => [...prevMessages, newMessage]);         
            //  setIsAttachFile(false);

        } catch (error) {
            console.error('Error sending file:', error);
            setUploading(false); // End upload in case of error
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#292929' }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <View style={styles.topContiner}>
                    <Text style={styles.titleText}>ONE Resume with Claude 3</Text>

                    <View style={styles.uploadContainer}>
                        {documentName ? (
                            <View style={styles.uploadedDocumentButton}>
                                <TouchableOpacity onPress={handleRemovePress}>
                                    <Icon type="font-awesome" name="close" size={15} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.documentName}>{documentName}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={_pickDocument} style={styles.uploadButton}>
                                <Text style={styles.uploadButtonText}>Upload your resume  </Text>
                                <Icon type="font-awesome" name="upload" size={15} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <ScrollView style={styles.messageContainer}>
                    {uploading && <ActivityIndicator style={styles.activityIndicator} size="large" color="white" />}

                    {messages.map(message => (
                        <Message key={message.id} isUser={message.isUser} text={message.text} />
                    ))}
                </ScrollView>

                <View style={styles.inputAreaContainer}>
                    <View style={styles.inputArea}>
                        <TextInput style={styles.input} placeholder="Message" placeholderTextColor="#D9D9D9" value={inputText}
                            onChangeText={setInputText}   />
                        <TouchableOpacity style={styles.sendButton} onPress={() => {
                            handleSendMessage(inputText);
                            setInputText('');
                        }}>
                            {/* Icon can be added here */}
                            <Text style={styles.sendButtonText}>↑</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 15,
        backgroundColor: '#292929'
    },

    messageBox: {
        marginLeft: 20,
        paddingBottom: 10,
        fontFamily: 'Nunito-Medium',
        flexDirection: 'row',
    },

    titleText: {
        marginTop: 65,
        marginLeft: 20,
        marginBottom: 10,
        fontFamily: 'Nunito-Medium',
        color: '#D9D9D9',
        fontSize: 19
    },

    topContiner: {
        borderBottomWidth: 1,
        borderColor: '#D9D9D9'
    },

    uploadContainer: {
        marginLeft: 20,
        width: 200,
        paddingBottom: 10
    },
    uploadedDocumentButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        borderWidth: 1.26,
        borderColor: '#EAEAEA',
        fontFamily: 'Nunito-Regular',
    },
    documentName: {
        color: '#fff',
        marginLeft: 10,
        fontFamily: 'Nunito-Regular',
        fontSize: 13.3
    },
    uploadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        borderWidth: 1.26,
        borderColor: '#EAEAEA',
        fontFamily: 'Nunito-Regular',
        fontSize: 13.3
    },
    uploadButtonText: {
        color: '#fff',
        fontFamily: 'Nunito-Regular',
        fontSize: 13.3
    },
    paperClip: {
        marginTop: 8,
        marginHorizontal: 5,
        transform: [{ rotateY: '180deg' }],
    },
    sendButton: { marginBottom: 10, marginRight: 10 },
    sendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'red',
        marginRight: 10
    },
    chatFooter: {
        shadowColor: '#1F2687',
        shadowOpacity: 0.37,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#00AEE9'
    },
    fileContainer: {
        flex: 1,
        maxWidth: 300,
        marginVertical: 2,
        borderRadius: 15,
    },
    fileText: {
        marginVertical: 5,
        fontSize: 16,
        lineHeight: 20,
        marginLeft: 10,
        marginRight: 5,
    },
    textTime: {
        fontSize: 10,
        color: 'gray',
        marginLeft: 2,
    },
    buttonFooterChat: {
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderColor: 'black',
        right: 3,
        top: -2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    buttonFooterChatImg: {
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderColor: 'black',
        left: 66,
        top: -4,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    textFooterChat: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'gray',
    },
    activityIndicator: {
        alignItems: 'center',
        color: 'white'
    },

    messageContainer: {
        flex: 1,
    },
    messageTop: {

        borderBottomWidth: 1,
        borderColor: '#D9D9D9',
        backgroundColor: '#333', // Ligh

    },

    messageTopUser: {
        borderBottomWidth: 1,
        borderColor: '#D9D9D9'
    },
    message: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        //  maxWidth: '70%',
        alignSelf: 'flex-start',

    },
    userMessage: {
        //  backgroundColor: '#333', // Lighter message bubble for user
        // alignSelf: 'flex-end',

        fontFamily: 'Nunito-Regular',
        fontSize: 13.3
    },
    botMessage: {
        //  backgroundColor: '#333', // Darker message bubble for bot
    },
    messageText: {
        color: '#fff',
        fontFamily: 'Nunito-Regular',
        fontSize: 13.3
    },

    inputAreaContainer: {
        padding: 20,
        paddingBottom: 20
    },
    inputArea: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 20
    },
    input: {
        flex: 1,
        paddingTop: 10,
        marginRight: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        color: '#fff',
        width: '90%',
        fontFamily: 'Nunito-Regular',
        fontSize: 13.3,

    },
    sendButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#00AEE9',
        borderRadius: 20,
        padding: 10
    },
    sendButtonText: {
        color: 'black',
        fontSize: 18,
    },

    userName: {
        paddingTop: 10,
        fontFamily: 'Nunito-Regular',
        fontSize: 13.3,
        color: '#00AEE9',
        paddingLeft: 10
    },

});

export default FileChatScreen;


