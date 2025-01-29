import React, { useEffect, useState } from 'react';
import { firestore } from './add/Firebase';
import { doc, setDoc, collection, onSnapshot, serverTimestamp, query, where } from 'firebase/firestore';
import { UAParser } from 'ua-parser-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './css/home.css';

function Online() {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDetailVisible, setIsDetailVisible] = useState(false);

    useEffect(() => {
        const parser = new UAParser();
        const uaResult = parser.getResult();
        const userId = localStorage.getItem('userId') || crypto.randomUUID();
        localStorage.setItem('userId', userId);

        const userStatusDocRef = doc(firestore, 'status', userId);

        const isOfflineForFirestore = { state: 'offline', last_changed: serverTimestamp() };
        const isOnlineForFirestore = {
            state: 'online',
            last_changed: serverTimestamp(),
            browser: uaResult.browser.name,
            os: uaResult.os.name,
            device: uaResult.device.model || 'Desktop',
            ip: localStorage.getItem('userIP') || '',
        };

        const fetchIpOnce = async () => {
            if (!localStorage.getItem('userIP')) {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                localStorage.setItem('userIP', data.ip);
                isOnlineForFirestore.ip = data.ip;
            }
        };

        fetchIpOnce();

        const updateStatus = async (isOnline) => {
            const status = isOnline ? isOnlineForFirestore : isOfflineForFirestore;
            await setDoc(userStatusDocRef, status, { merge: true });
        };

        updateStatus(true);

        const userStatusCollectionRef = collection(firestore, 'status');
        const onlineUsersQuery = query(userStatusCollectionRef, where('state', '==', 'online'));
        const unsubscribe = onSnapshot(onlineUsersQuery, (snapshot) => {
            setOnlineUsers(snapshot.docs.map((doc) => doc.data()));
            setLoading(false);
        });

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                updateStatus(false);
            } else {
                updateStatus(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            updateStatus(false);
            unsubscribe();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const toggleDetails = () => setIsDetailVisible(!isDetailVisible);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container-online-users">
            <h1>👥🟢 Online: {onlineUsers.length}</h1>
            <h5>
                <button onClick={toggleDetails}>
                    <FontAwesomeIcon icon={isDetailVisible ? faChevronUp : faChevronDown} />
                    {isDetailVisible ? ' Hide' : ' Show'}
                </button>
            </h5>

            {isDetailVisible && (
                <ul>
                    {onlineUsers.map((user, index) => (
                        <li key={index}>
                            <p>Browser: {user.browser}</p>
                            <p>IP Address: {user.ip}</p>
                            <p>OS: {user.os}</p>
                            <p>Device: {user.device}</p>
                            <p>Last Changed: {user.last_changed ? new Date(user.last_changed.toDate()).toLocaleString() : 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Online;

