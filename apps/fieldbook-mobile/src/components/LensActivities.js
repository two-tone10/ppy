import React, {useState} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';

const activities = [
  ['Try it', 'What is one small thing you want to try?', 'TRY SOMETHING'],
  ['Someone noticed', 'Who saw something good in you today?', 'FEEL SEEN'],
  ['What helped?', 'What person, place, tool, or permission helped?', 'FIND A WAY'],
  ['The room around you', 'What did this space say about whose ideas count?', 'MAKE ROOM'],
];

export default function LensActivities({styles, onSave}) {
  const [active, setActive] = useState(null);
  const choices = ['A little','Some','A lot'];
  if (active) return <View style={styles.lensPrompt}><Text style={styles.lensTitle}>{active[0]}</Text><Text style={styles.lensBody}>{active[1]}</Text><View style={styles.choiceRow}>{choices.map(choice=><Pressable key={choice} style={styles.choice} onPress={()=>{onSave(`${active[0]}: ${choice}`,active[2]);setActive(null)}}><Text style={styles.choiceText}>{choice}</Text></Pressable>)}</View><TextInput placeholder="Add a note (optional)…" style={styles.lensInput} onSubmitEditing={e=>{if(e.nativeEvent.text)onSave(e.nativeEvent.text,active[2]);setActive(null)}} returnKeyType="done"/><Pressable onPress={()=>setActive(null)}><Text style={styles.lensClose}>Not right now</Text></Pressable></View>;
  return <View style={styles.lensGrid}>{activities.map(item => <Pressable key={item[0]} style={styles.lensCard} onPress={() => setActive(item)}><Text style={styles.lensTitle}>{item[0]}</Text><Text style={styles.lensBody}>{item[1]}</Text><Text style={styles.lensTap}>Tap to check in →</Text></Pressable>)}</View>;
}
