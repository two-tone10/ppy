import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, ImageBackground} from 'react-native';

export default function CompassGarden({styles, count=0, signals=[], mood}) {
  return null;
  const leaves = Math.min(count, 12);
  const bloom = useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.spring(bloom,{toValue:1,useNativeDriver:true,damping:13}).start()},[leaves]);
  const colors={tried:'#ec735f',seen:'#8e607e',helped:'#4d8b80',other:'#35405a'};
  return <View style={styles.garden}><Text style={styles.gardenKicker}>YOUR COMPASS GARDEN</Text><ImageBackground source={require('../../assets/our-sky-art.png')} imageStyle={styles.gardenImage} style={styles.gardenScene}><View style={styles.gardenWash}/>{signals.slice(0,12).map((signal,i)=><Animated.Text key={`${signal.body}-${i}`} style={[styles.gardenLeaf,{color:colors[signal.tag]||colors.other,left:35+(i%6)*42,top:30+Math.floor(i/6)*32,transform:[{rotate:i%2?'18deg':'-18deg'},{scale:bloom}]}]}>✦</Animated.Text>)}{mood&&<Text style={styles.gardenMood}>◉</Text>}{!leaves&&<Text style={styles.gardenHint}>Each check-in plants a little signal here.</Text>}</ImageBackground><Text style={styles.gardenSub}>{leaves ? `${leaves} signal${leaves===1?'':'s'} growing` : 'Start with one small check-in.'}</Text></View>;
}
