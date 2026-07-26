import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, ImageBackground, Pressable, ScrollView, Text, View} from 'react-native';

const pieces=[
  ['first light','You opened Compass today.'],['a path','You noticed where you were landing.'],['a window','You named something that mattered.'],['a doorway','You found a little room to move.'],['a spark','You left a trace.'],
  ['a step','You tried, made, led, or explored.'],['a bridge','Something reached beyond you.'],['a signal','Someone saw what you brought.'],['a key','Something helped make it possible.'],['a seat','The space made room.'],
  ['a second path','You came back to a moment.'],['a new color','You added your own mark.'],['a crossing','You connected two ideas.'],['a roof','You made a place feel safer.'],['a garden','Something began to grow.'],
  ['a skyline','Your day held more than one thing.'],['a horizon','You noticed a direction.'],['a gathering','Your world included other people.'],['a compass','You found a little orientation.'],['the picture','A fuller day came into view.']
];

export default function PuzzleBuild({styles,signals=[],mood}){
  const unlocked=Math.min(20,1+(mood?2:0)+Math.min(12,signals.length*2));
  const progress=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.spring(progress,{toValue:unlocked/20,useNativeDriver:false,bounciness:5}).start()},[unlocked]);
  const fill=progress.interpolate({inputRange:[0,1],outputRange:['0%','100%']});
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.puzzleScroll}><View style={styles.puzzlePage}><Text style={styles.back}>← Today</Text><Text style={styles.eyebrow}>YOUR DAILY BUILD</Text><Text style={styles.puzzleTitle}>Something is{`\n`}taking shape.</Text><Text style={styles.puzzleLead}>Every little thing you do in Compass adds a piece. Come back later and see what the day becomes.</Text><ImageBackground source={require('../../assets/compass-splash.png')} style={styles.puzzleCanvas} imageStyle={styles.puzzleImage}>{pieces.map(([name,desc],i)=>{const open=i<unlocked;return <Pressable key={name} accessibilityRole="button" onPress={()=>{}} style={[styles.puzzlePiece,{left:`${(i%5)*20}%`,top:`${Math.floor(i/5)*25}%`},open?styles.puzzlePieceOpen:styles.puzzlePieceClosed]}><Text style={styles.puzzlePieceMark}>{open?'✦':'·'}</Text>{open&&<Text style={styles.puzzlePieceName}>{name}</Text>}</Pressable>})}</ImageBackground><View style={styles.puzzleProgressRow}><Text style={styles.puzzleProgressLabel}>{unlocked} of 20 pieces</Text><View style={styles.puzzleProgressTrack}><Animated.View style={[styles.puzzleProgressFill,{width:fill}]}/></View></View><Text style={styles.puzzleHint}>{unlocked<20?'Keep moving through your day. The next piece is waiting.':'The whole picture is here for today.'}</Text></View></ScrollView>;
}
