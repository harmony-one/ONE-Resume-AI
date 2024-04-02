import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const ChatScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessageToTelegram = async (text) => {
        const chatId = '1242'; // The chat ID for the conversation
        const token = 'Your Telegram bot token'; // Your Telegram bot token
        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                }),
            });

            const data = await response.json();
            console.log('Message sent:', data);
            setMessage(''); // Clear input after sending
            // Optionally, refresh your chat here to show the sent message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const sendMessage = () => {
        if (message.trim().length > 0) {
            setMessages([...messages, { id: Date.now().toString(), text: message }]);
            sendMessageToTelegram(message);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.messageList}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.message}>{item.text}</Text>
                )}
            />
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        flex: 1,
    },
    message: {
        marginVertical: 4,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        margin: 10,
    },
});

export default ChatScreen;
