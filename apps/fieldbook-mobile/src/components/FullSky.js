import React from 'react';
import {View, Text, Pressable, ImageBackground} from 'react-native';
import PuzzleBuild from './PuzzleBuild';

export default function FullSky({styles, moods = [], onBack}) {
  return <>
    <Pressable onPress={onBack}><Text style={styles.back}>← Today</Text></Pressable>
    <Text style={styles.eyebrow}>THE GROUP VIBE · ANONYMOUS</Text>
    <Text style={styles.h2}>Look what{`\n`}<Text style={styles.italic}>we found.</Text></Text>
    <Text style={styles.lede}>A shared weather check. No names, no scores—just a picture of how the room is landing.</Text>
    <ImageBackground source={require('../../assets/our-sky-art.png')} imageStyle={styles.fullSkyImage} style={styles.fullSky}>
      <Text style={styles.fullSkyCompass}>✦</Text>
      {moods.length ? moods.map((m, i) => <Text key={i} style={[styles.fullSkyDot, {left: 20 + ((i * 47) % 70) + '%', top: 18 + ((i * 31) % 65) + '%'}]}>{i % 3 === 0 ? '✦' : '·'}</Text>) : <Text style={styles.fullSkyHint}>The sky opens after five check-ins.</Text>}
    </ImageBackground>
    <Text style={styles.skyReflection}>{moods.length ? 'Every dot is one small signal from the group.' : 'Invite a few people to place their weather, then come back here.'}</Text>
    <Text style={styles.puzzleLaunchText}>YOUR DAILY BUILD</Text>
    <PuzzleBuild styles={styles} signals={moods} mood={moods.length ? moods[0] : null} />
  </>;
}
