import React, { useState, useEffect, useRef } from 'react';

function Chatbot({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const messagesEndRef = useRef(null);

    const API_KEY = "Hi! I'm your gym and fitness assistant! 💪 However, the AI service is not configured. Please contact the administrator to set up the OpenRouter API key.";
    const MODEL = "mistralai/mistral-7b-instruct:free";
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to get AI response
    const getAIResponse = async (prompt, conversationHistory = []) => {
        try {
            console.log('Making API request to:', API_URL);
            console.log('Using model:', MODEL);

            const conversation = [
                { 
                    role: "system", 
                    content: `You are a professional gym and fitness assistant. You can only answer questions related to:
                    - Gym equipment and how to use it
                    - Workout routines and exercises
                    - Fitness training techniques
                    - Nutrition for fitness and bodybuilding
                    - Recovery and rest periods
                    - Gym safety and proper form
                    - Muscle building and strength training
                    - Cardio and endurance training
                    - Gym membership and class information
                    - Personal training advice
                    
                    If someone asks about topics unrelated to fitness, gym, or training, politely redirect them by saying "I'm a gym and fitness assistant, and I can only help with questions about fitness, training, gym equipment, nutrition, and related topics. Please ask me something about your fitness journey!"
                    
                    Always provide helpful, accurate, and motivating fitness advice. Keep your responses concise but informative.`
                },
                ...conversationHistory,
                { role: "user", content: prompt }
            ];

            const requestBody = {
                model: MODEL,
                messages: conversation,
                temperature: 0.7,
                max_tokens: 1000
            };

            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Gym Assistant'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error(`Invalid JSON response: ${responseText}`);
            }

            if (!response.ok) {
                console.error('API Error Response:', data);
                throw new Error(
                    `API Error (${response.status}): ${data.error?.message || data.error || JSON.stringify(data)}`
                );
            }

            if (!data.choices?.[0]?.message?.content) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response format from API');
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            throw error;
        }
    };

    // Get initial welcome message when component mounts
    useEffect(() => {
        const getWelcomeMessage = async () => {
            setIsLoading(true);
            try {
                const welcomePrompt = `Provide a brief welcome message as a gym and fitness assistant. Mention that you can help with workouts, nutrition, gym equipment, training techniques, and fitness goals. Keep it friendly and motivating, under 100 words.`;
                const welcome = await getAIResponse(welcomePrompt);
                setMessages([{ role: 'assistant', content: welcome }]);
            } catch (error) {
                console.error('Welcome message error:', error);
                setMessages([{ 
                    role: 'assistant', 
                    content: "Hi! I'm your gym and fitness assistant! 💪 I'm here to help you with workouts, nutrition, gym equipment, training techniques, and achieving your fitness goals. Whether you're a beginner or experienced, feel free to ask me anything about fitness and training!" 
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        getWelcomeMessage();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const reply = await getAIResponse(userMessage, messages);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error('Question handling error:', error);
            setToastMessage(`Failed to get response: ${error.message}`);
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '380px',
            backgroundColor: '#FFFFFF',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            border: '2px solid #007BFF',
            zIndex: 1000
        }}>
            <div style={{
                padding: '15px 20px',
                background: 'linear-gradient(135deg, #007BFF 0%, #38B6FF 100%)',
                color: '#FFFFFF',
                borderRadius: '15px 15px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    💪 Gym Assistant
                </h3>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        padding: '0',
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    ×
                </button>
            </div>
            
            <div style={{
                height: '400px',
                overflowY: 'auto',
                padding: '15px',
                backgroundColor: '#F8F9FA'
            }}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '12px 15px',
                            borderRadius: '12px',
                            marginBottom: '10px',
                            maxWidth: '85%',
                            backgroundColor: message.role === 'user' ? '#007BFF' : '#FFFFFF',
                            color: message.role === 'user' ? '#FFFFFF' : '#343A40',
                            marginLeft: message.role === 'user' ? 'auto' : '0',
                            marginRight: message.role === 'user' ? '0' : 'auto',
                            border: message.role === 'assistant' ? '1px solid #E0E0E0' : 'none',
                            boxShadow: message.role === 'assistant' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                            fontSize: '14px',
                            lineHeight: '1.4'
                        }}
                    >
                        {message.content}
                    </div>
                ))}
                {isLoading && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#6C757D',
                        fontSize: '14px',
                        padding: '10px 15px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#007BFF',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s ease-in-out infinite both'
                        }}></div>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#007BFF',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                        }}></div>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#007BFF',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                        }}></div>
                        <span style={{ marginLeft: '8px' }}>Assistant is typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{
                padding: '15px',
                borderTop: '1px solid #E0E0E0',
                backgroundColor: '#FFFFFF',
                borderRadius: '0 0 15px 15px'
            }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about workouts, nutrition, equipment..."
                        style={{
                            flex: 1,
                            padding: '12px 15px',
                            border: '2px solid #E0E0E0',
                            borderRadius: '20px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: '#F8F9FA'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007BFF'}
                        onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #007BFF 0%, #38B6FF 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1,
                            minWidth: '60px'
                        }}
                    >
                        {isLoading ? '...' : 'Send'}
                    </button>
                </div>
            </form>

            {showToast && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '15px',
                    right: '15px',
                    backgroundColor: '#F8D7DA',
                    border: '1px solid #F5C6CB',
                    color: '#721C24',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{toastMessage}</span>
                    <button
                        onClick={() => setShowToast(false)}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#721C24',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: 'pointer',
                            padding: '0',
                            marginLeft: '10px'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <style>
                {`
                    @keyframes bounce {
                        0%, 80%, 100% {
                            transform: scale(0);
                        } 40% {
                            transform: scale(1);
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default Chatbot;
