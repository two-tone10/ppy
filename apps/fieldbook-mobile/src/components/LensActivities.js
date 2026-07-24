import React, {useState} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';

const activities = [
  ['Try it', 'What is one small thing you want to try?', 'TRY SOMETHING', '#ec735f'],
  ['Someone noticed', 'Who saw something good in you today?', 'FEEL SEEN', '#8e607e'],
  ['What helped?', 'What person, place, tool, or permission helped?', 'FIND A WAY', '#4d8b80'],
  ['The room around you', 'What did this space say about whose ideas count?', 'MAKE ROOM', '#35405a'],
];

export default function LensActivities({styles, onSave}) {
  const [active, setActive] = useState(null);
  const [choice, setChoice] = useState(null);
  const [note, setNote] = useState('');
  const choices = ['A little','Some','A lot'];
  const close=()=>{setActive(null);setChoice(null);setNote('')};
  if (active) return <View style={styles.lensPrompt}><Text style={styles.lensTitle}>{active[0]}</Text><Text style={styles.lensBody}>{active[1]}</Text><View style={styles.choiceRow}>{choices.map(value=><Pressable key={value} style={[styles.choice,choice===value&&styles.choiceSelected]} onPress={()=>setChoice(value)}><Text style={[styles.choiceText,choice===value&&styles.choiceTextSelected]}>{value}</Text></Pressable>)}</View><TextInput value={note} onChangeText={setNote} placeholder="Add a note (optional)…" style={styles.lensInput}/><Pressable disabled={!choice} style={[styles.saveLens, !choice&&styles.saveLensDisabled]} onPress={()=>{onSave(`${active[0]}: ${choice}${note?` — ${note}`:''}`,active[2]);close()}}><Text style={styles.saveLensText}>Save this check-in</Text></Pressable><Pressable onPress={close}><Text style={styles.lensClose}>Not right now</Text></Pressable></View>;
  return <View style={styles.lensGrid}>{activities.map(item => <Pressable key={item[0]} style={[styles.lensCard,{backgroundColor:item[3]}]} onPress={() => setActive(item)}><Text style={styles.lensTitleLight}>{item[0]}</Text><Text style={styles.lensBodyLight}>{item[1]}</Text><Text style={styles.lensTapLight}>Tap to check in →</Text></Pressable>)}</View>;
}
