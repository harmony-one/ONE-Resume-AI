import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, ActivityIndicator, StatusBar, Keyboard } from 'react-native';
import { Bubble, GiftedChat, Send, IMessage } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import NavBar from './components/navbar';
import InChatFileTransfer from './components/InChatFileTranfer';
import InChatViewFile from './components/InChatViewFile';
import * as DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
//Project managers are responsible for planning and overseeing projects to ensure they are completed on time and within budget. They identify the projects goals, objectives, and scope, and create a project plan that outlines the tasks, timelines, and resources required. They also communicate with the project team and stakeholders, manage risks and issues, and monitor progress

const FileChatScreen = () => {
    const [isAttachImage, setIsAttachImage] = useState(false);
    const [isAttachFile, setIsAttachFile] = useState(false);
    const [fileVisible, setFileVisible] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const [filePath, setFilePath] = useState('');
    const [uploading, setUploading] = useState(false); // State to track uploading
    const [messages, setMessages] = useState([
        {
            _id: 1,
            text: 'Welcome to ONE Resume! \nSubmit your resume with job description',
            createdAt: new Date(),
            user: {
                _id: 1,
                name: 'UserChat',
                avatar: '',
            },
            image: '',
            file: {
                url: '',
            }
        },
    ]);

    const navigation = useNavigation();

    const onSend = useCallback((messages = []) => {
        const [messageToSend] = messages;

        const sendMessage = async () => {
            if (isAttachImage) {
                const newMessage = {
                    _id: messages[0]._id + 1,
                    text: messageToSend.text,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        avatar: '',
                    },
                    image: imagePath,
                    file: {
                        url: ''
                    }
                };
                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, newMessage),
                );
                setImagePath('');
                setIsAttachImage(false);
            } else if (isAttachFile) {
                Keyboard.dismiss();

                setUploading(true); // Start upload

                try {
                var name = filePath.split('/').pop();
                const formData = new FormData();
                formData.append('pdf', {
                    uri: filePath,
                    type: 'pdf',
                    name: name.replace('%20', '').replace(' ', '')
                });

                console.log('messageToSend.text',  messageToSend.text);
                formData.append('model', 'claude-3-haiku-20240307');
                formData.append('jobDescription', messageToSend.text);
                formData.append('maxTokens', '1024');
                const response = await fetch('Add your API URL', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const jsonResponse = await response.json();
                console.log('jsonResponse:', jsonResponse);
                setUploading(false); // End upload
                // Use jsonResponse in your new message
                const newMessage = {
                    _id: messages[0]._id + 1,
                    text: jsonResponse, // Example, adjust based on actual jsonResponse structure
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                        avatar: '',
                        name: 'UserChat',
                    },
                    file: {
                        url: filePath,
                    },
                };

                setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
                setFilePath('');
                setIsAttachFile(false);

            } catch (error) {
                console.error('Error sending file:', error);
                setUploading(false); // End upload in case of error
            }
            } else {

                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, messages),
                );
            }
        };

        sendMessage();
    }, [filePath, imagePath, isAttachFile, isAttachImage, setMessages, setUploading]);

    const renderSend = (props) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={_pickDocument}>
                    <Icon
                        type="font-awesome"
                        name="paperclip"
                        style={styles.paperClip}
                        size={28}
                        color='#00AEE9'
                    />
                </TouchableOpacity>
                <Send {...props}>
                    <View style={styles.sendContainer}>
                        <Icon
                            type="font-awesome"
                            name="send"
                            style={styles.sendButton}
                            size={25}
                            color='#00AEE9'
                        />
                    </View>
                </Send>
            </View>
        );
    };

    const renderBubble = (props) => {
        const { currentMessage } = props;
        if (currentMessage.file && currentMessage.file.url) {
            return (
                <TouchableOpacity
                    style={{
                        ...styles.fileContainer,
                        backgroundColor: props.currentMessage.user._id === 2 ? '#00AEE9' : '#efefef',
                        borderBottomLeftRadius: props.currentMessage.user._id === 2 ? 15 : 5,
                        borderBottomRightRadius: props.currentMessage.user._id === 2 ? 5 : 15,
                    }}
                    onPress={() => setFileVisible(true)}
                >
                    <InChatFileTransfer
                        style={{ marginTop: -10 }}
                        filePath={currentMessage.file.url}
                    />
                    <InChatViewFile
                        props={props}
                        visible={fileVisible}
                        onClose={() => setFileVisible(false)}
                    />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{
                            ...styles.fileText,
                            color: currentMessage.user._id === 2 ? 'white' : 'black',
                        }} >
                            {currentMessage.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#00AEE9',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#efefef',
                    },
                }}
            />
        );
    };

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
            console.log(fileUri);
            if (!fileUri) {
                console.log('File URI is undefined or null');
                return;
            }
            if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
                setImagePath(fileUri);
                setIsAttachImage(true);
            } else {
                setFilePath(fileUri);
                setIsAttachFile(true);
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

    const renderChatFooter = useCallback(() => {
        if (imagePath) {
            return (
                <View style={styles.chatFooter}>
                    <Image source={{ uri: imagePath }} style={{ height: 75, width: 75 }} />
                    <TouchableOpacity
                        onPress={() => setImagePath('')}
                        style={styles.buttonFooterChatImg}
                    >
                        <Text style={styles.textFooterChat}>X</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (filePath) {
            return (
                <View style={styles.chatFooter}>
                    <InChatFileTransfer
                        filePath={filePath}
                    />
                    <TouchableOpacity
                        onPress={() => setFilePath('')}
                        style={styles.buttonFooterChat}
                    >
                        <Text style={styles.textFooterChat}>X</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    }, [filePath, imagePath]);

    const scrollToBottomComponent = () => {
        return <FontAwesome name="angle-double-down" size={22} color="#333" />;
    };
    return (
        <View style={styles.container}>
        <StatusBar hidden={true} />
        {uploading && <ActivityIndicator style= {styles.activityIndicator} size="large" color="grey" />}
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 2,
                }}
                renderBubble={renderBubble}
                alwaysShowSend
                renderSend={renderSend}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                renderChatFooter={renderChatFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 15
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
    activityIndicator : {
        alignItems: 'center',
    }
});

export default FileChatScreen;


