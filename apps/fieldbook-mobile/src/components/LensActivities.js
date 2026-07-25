import React, {useState} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';

const activities = [
  ['What mattered to you today?', 'Did anything today feel important, meaningful, or worth your energy?', 'purpose', '#9b5b4d'],
  ['Who did it reach?', 'Did what you care about connect to someone, a group, or something bigger than you?', 'scope', '#806d52'],
  ['Which way were you moving?', 'Did you feel a sense of direction, even if it changed during the day?', 'orientation', '#657b68'],
  ['What were you drawn to?', 'Did a topic, idea, person, or problem keep pulling your attention today?', 'content', '#6f5577'],
  ['Did you get to try something?', 'Did you get a real chance to try, make, lead, or explore something today?', 'tried', '#ec735f'],
  ['Did someone see it?', 'Did someone notice, name, or reflect back something you brought today?', 'seen', '#8e607e'],
  ['What helped you do it?', 'Did a person, place, tool, time, or bit of permission make something possible today?', 'helped', '#4d8b80'],
  ['Did the room make space?', 'Did this space show you that your ideas, culture, or contribution counted today?', 'other', '#35405a'],
];

export default function LensActivities({styles, onSave}) {
  const [active, setActive] = useState(null);
  const [choice, setChoice] = useState(5); const [trackWidth,setTrackWidth]=useState(280);
  const [note, setNote] = useState('');
  const close=()=>{setActive(null);setChoice(5);setNote('')};
  const setFromTouch=e=>setChoice(Math.max(0,Math.min(10,Math.round((e.nativeEvent.locationX/trackWidth)*10)*0.1)));
  if (active) return <View style={styles.lensPrompt}><Text style={styles.lensTitle}>{active[0]}</Text><Text style={styles.lensBody}>{active[1]}</Text><View style={styles.sliderTrack} onLayout={e=>setTrackWidth(e.nativeEvent.layout.width)} onStartShouldSetResponderCapture={()=>true} onMoveShouldSetResponderCapture={()=>true} onResponderGrant={setFromTouch} onResponderMove={setFromTouch}><View style={[styles.sliderFill,{width:`${choice*10}%`}]}/><View style={[styles.sliderThumb,{left:`${choice*10}%`}]}/></View><View style={styles.sliderLabels}><Text style={styles.sliderLabel}>Not at all</Text><Text style={styles.sliderLabel}>Extremely</Text></View><TextInput value={note} onChangeText={setNote} placeholder="Add a note (optional)…" style={styles.lensInput}/><Pressable style={styles.saveLens} onPress={()=>{onSave(`${active[0]}${note?` — ${note}`:''}`,active[2],choice);close()}}><Text style={styles.saveLensText}>Save this check-in</Text></Pressable><Pressable onPress={close}><Text style={styles.lensClose}>Not right now</Text></Pressable></View>;
  return <View style={styles.lensGrid}>{activities.map(item => <Pressable key={item[0]} style={[styles.lensCard,{backgroundColor:item[3]}]} onPress={() => setActive(item)}><Text style={styles.lensTitleLight}>{item[0]}</Text><Text style={styles.lensBodyLight}>{item[1]}</Text><Text style={styles.lensTapLight}>Tap to check in →</Text></Pressable>)}</View>;
}
