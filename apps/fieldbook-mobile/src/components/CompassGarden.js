import React from 'react';
import {View, Text} from 'react-native';

export default function CompassGarden({styles, count=0}) {
  const leaves = Math.min(count, 12);
  return <View style={styles.garden}><Text style={styles.gardenKicker}>YOUR COMPASS GARDEN</Text><View style={styles.gardenScene}><Text style={styles.gardenStem}>│{`\n`}│{`\n`}│</Text>{Array.from({length:leaves}).map((_,i)=><Text key={i} style={[styles.gardenLeaf,{left:35+(i%6)*42,top:30+Math.floor(i/6)*32,transform:[{rotate:i%2?'18deg':'-18deg'}]}]}>✦</Text>)}{!leaves&&<Text style={styles.gardenHint}>Each check-in plants a little signal here.</Text>}</View><Text style={styles.gardenSub}>{leaves ? `${leaves} signal${leaves===1?'':'s'} growing` : 'Start with one small check-in.'}</Text></View>;
}
