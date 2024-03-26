import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import * as Progress from 'react-native-progress';
import DocumentPicker from 'react-native-document-picker';

const UploadScreen = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            setUploading(true);
            setUploadProgress(0);

            // Simulate file upload progress
            const interval = setInterval(() => {
                setUploadProgress(currentProgress => {
                    const nextProgress = currentProgress + 0.1;
                    if (nextProgress >= 1) {
                        clearInterval(interval);
                        setUploading(false);
                    }
                    return nextProgress;
                });
            }, 500);

            // TODO: Implement actual file upload logic here
            console.log('Uploading:', res.name);
        } catch (err) {
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
                    <Text style={styles.progressText} >Uploading...</Text>
                    {/*<Progress.Bar progress={uploadProgress} width={200} />*/}
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
        borderWidth: 1,  // If you want a border, set the borderWidth
        backgroundColor: '#404040',  // Set the background color
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        alignItems: "center"
    },
    progressText: {
        color: 'white',
        fontSize: 10,
        alignItems: "center"
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default UploadScreen;
