import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Text, View, Button } from 'react-native';
import { Link } from 'expo-router';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        // Warm up the Android browser to improve UX for OAuth
        // Reference: https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

// Required to complete the browser OAuth flow on iOS
WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const onPress = React.useCallback(async () => {
        try {
            const redirectUrl = Linking.createURL('/dashboard', {
                scheme: 'myapp', // Ensure "myapp" matches your deep linking config
            });

            const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({ redirectUrl });

            if (createdSessionId && setActive) {
                // Set the active session after successful OAuth
                await setActive({ session: createdSessionId });
            } else if (signIn || signUp) {
                // Handle further steps such as MFA or profile completion
                console.log('Additional steps required for sign-in or sign-up.');
            } else {
                console.warn('No session or user data was returned.');
            }
        } catch (err) {
            console.error('OAuth error:', err);
        }
    }, [startOAuthFlow]);

    return (
        <View>
            <Link href="/">
                <Text>Home</Text>
            </Link>
            <Button title="Sign in with Google" onPress={onPress} />
        </View>
    );
};

export default SignInWithOAuth;
