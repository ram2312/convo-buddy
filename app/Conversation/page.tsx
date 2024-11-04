// @ts-nocheck
"use client";
import 'regenerator-runtime/runtime';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import LeftNavigation from '../components/LeftNavigation';
import styles from '../styles/Conversation.module.css';

export default function Conversation() {
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState<{ sender: string; content: string }[]>([]);
  const [fullName, setFullName] = useState('');
  const [isClient, setIsClient] = useState(false);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setIsClient(true);

    // Fetch the user's full name from local storage or an API
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        try {
          const response = await fetch(`/api/profile?email=${userEmail}`);
          if (response.ok) {
            const data = await response.json();
            setFullName(data.full_name || ""); // Set the full name from the data
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  if (!isClient) {
    return null;
  }

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const handleSubmitMessage = async () => {
    const messageContent = transcript || userMessage;
    if (!messageContent.trim()) return;

    // Add user message to conversation
    setConversation((prev) => [...prev, { sender: 'user', content: messageContent }]);
    setUserMessage('');
    resetTranscript();

    // Send the message to the bot API and get response
    try {
      const response = await axios.post('/api/chat', { message: messageContent });
      const botMessage = response.data.response || 'Sorry, I didn’t understand that.';
      setConversation((prev) => [...prev, { sender: 'bot', content: botMessage }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = error?.response?.data?.error || 'Sorry, something went wrong.';
      setConversation((prev) => [...prev, { sender: 'bot', content: errorMessage }]);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <LeftNavigation />

      <div className="ml-64 p-8">
        <h1 className={`${styles.pageTitle} text-3xl font-semibold mb-8`}>Direct Chat</h1>

        <div className={styles.conversationContainer}>
          <div className={styles.messageList}>
            {/* Display a greeting message with the user's name, using botMessage style */}
            {!fullName ? (
              <div className={styles.botMessage}>
                <div>Hello! How are you today? How may I help you?</div>
              </div>
            ) : (
              <div className={styles.botMessage}>
                <div>Hello {fullName}! How are you today? How may I help you?</div>
              </div>
            )}
            
            {conversation.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>

          <div className={styles.messageInputContainer}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={transcript || userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Write a message..."
                className={styles.messageInput}
              />
              <button onClick={handleVoiceInput} className={styles.voiceButton}>
                {/* Replace with actual microphone SVG */}
                <img src="/images/mic.svg" alt="Mic"  />
              </button>
              <button onClick={handleSubmitMessage} className={styles.sendButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <g clipPath="url(#clip0_4236_1839)">
                    <path d="M11.9336 1.06665L6.06689 6.93332" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.9338 1.06665L8.20042 11.7333L6.06709 6.93332L1.26709 4.79998L11.9338 1.06665Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_4236_1839">
                      <rect width="12.8" height="12.8" fill="white" transform="translate(0.200195)"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
