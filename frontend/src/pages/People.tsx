import React, { useEffect, useState } from 'react';
import { fetchRecommenders, RecommendationInterface, sendFriendRequest } from '../services/authService';
import ProfileComponent from '../styles/ProfileComponent';

import play_svg from '../icons/play_svg.svg';
import skip_svg from '../icons/skip_svg.svg';
import rewind_svg from '../icons/rewind_svg.svg';
import pause_svg from '../icons/pause_svg.svg';
import default_svg from '../icons/default_svg.svg';

const People: React.FC = () => {
    const [profiles, setProfiles] = useState<RecommendationInterface[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playPauseStates, setPlayPauseStates] = useState<boolean[]>([]);
    const [error, setError] = useState<string>(''); 
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const profileData = await fetchRecommenders();
                setProfiles(profileData);
                setPlayPauseStates(Array(profileData.length).fill(false));
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to load profiles.');
                setLoading(false);
            }
        };

        loadProfiles();
    }, []);

    const skipProfile = () => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const rewindProfile = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const togglePlayPause = async () => {
        const currentProfile = profiles[currentIndex];
        const currentRequestSentState = playPauseStates[currentIndex];
        
        if(currentRequestSentState){
            return
        }

        try {
            setPlayPauseStates((prevStates) => {
                const updatedStates = [...prevStates];
                updatedStates[currentIndex] = !updatedStates[currentIndex];
            return updatedStates;
            });

            const updatedReqProfile = await sendFriendRequest(currentProfile.userId);

            // setProfiles([...profiles].filter(p => p.userId != currentProfile.userId));

        } catch (err: any) {
            setError(err.message || 'Failed to send match request.');
        }
    };

    if (loading) return <div>Loading Profiles...</div>;
    if (error) return <div>{error}</div>;

    const { username, description, dateOfBirth, year, major, college, classes, hobby, musicPreference, favArtists } = profiles[currentIndex];

    return (
        <>
            <div>
                <ProfileComponent
                    key={profiles[currentIndex].userId}
                    profilePic={default_svg}
                    userId={profiles[currentIndex].userId}
                    username={username}
                    description={description}
                    dateOfBirth={new Date(dateOfBirth)}
                    year={year}
                    major={major}
                    college={college}
                    classes={classes}
                    hobby={hobby}
                    musicPreference={musicPreference}
                    favArtists={favArtists}
                />
            </div>

            <div className="media-controls">
                <button onClick={rewindProfile} disabled={currentIndex === 0}>
                    <img src={rewind_svg} alt="Rewind" />
                </button>
                <button onClick={togglePlayPause}>
                    <img src={playPauseStates[currentIndex] ? pause_svg : play_svg} alt="Play/Pause" style={{ width: '40px', height: '40px' }} />
                </button>
                <button onClick={skipProfile} disabled={currentIndex === profiles.length - 1}>
                    <img src={skip_svg} alt="Skip" />
                </button>
            </div>
        </>
    );
}

export default People;