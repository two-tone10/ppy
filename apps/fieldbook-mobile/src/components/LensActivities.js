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
  const [choice, setChoice] = useState(5);
  const [note, setNote] = useState('');
  const close=()=>{setActive(null);setChoice(null);setNote('')};
  if (active) return <View style={styles.lensPrompt}><Text style={styles.lensTitle}>{active[0]}</Text><Text style={styles.lensBody}>{active[1]}</Text><Text style={styles.sliderValue}>{choice} / 10</Text><Pressable style={styles.sliderTrack} onPress={e=>setChoice(Math.max(0,Math.min(10,Math.round((e.nativeEvent.locationX/280)*10))))}><View style={[styles.sliderFill,{width:`${choice*10}%`}]}/><View style={[styles.sliderThumb,{left:`${choice*10}%`}]}/></Pressable><View style={styles.sliderLabels}><Text style={styles.sliderLabel}>Not at all</Text><Text style={styles.sliderLabel}>Extremely</Text></View><TextInput value={note} onChangeText={setNote} placeholder="Add a note (optional)…" style={styles.lensInput}/><Pressable style={styles.saveLens} onPress={()=>{onSave(`${active[0]}: ${choice}/10${note?` — ${note}`:''}`,active[2],choice);close()}}><Text style={styles.saveLensText}>Save this check-in</Text></Pressable><Pressable onPress={close}><Text style={styles.lensClose}>Not right now</Text></Pressable></View>;
  return <View style={styles.lensGrid}>{activities.map(item => <Pressable key={item[0]} style={[styles.lensCard,{backgroundColor:item[3]}]} onPress={() => setActive(item)}><Text style={styles.lensTitleLight}>{item[0]}</Text><Text style={styles.lensBodyLight}>{item[1]}</Text><Text style={styles.lensTapLight}>Tap to check in →</Text></Pressable>)}</View>;
}
