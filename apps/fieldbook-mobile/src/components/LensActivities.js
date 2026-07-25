import React, {useState} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';

const activities = [
  ['Did you get to try something?', 'Did you get a real chance to try, make, lead, or explore something today?', 'TRY SOMETHING', '#ec735f'],
  ['Did someone see it?', 'Did someone notice, name, or reflect back something you brought today?', 'FEEL SEEN', '#8e607e'],
  ['What helped you do it?', 'Did a person, place, tool, time, or bit of permission make something possible today?', 'FIND A WAY', '#4d8b80'],
  ['Did the room make space?', 'Did this space show you that your ideas, culture, or contribution counted today?', 'MAKE ROOM', '#35405a'],
];

export default function LensActivities({styles, onSave}) {
  const [active, setActive] = useState(null);
  const [choice, setChoice] = useState(5);
  const [note, setNote] = useState('');
  const close=()=>{setActive(null);setChoice(null);setNote('')};
  const setFromTouch=e=>setChoice(Math.max(0,Math.min(10,Math.round((e.nativeEvent.locationX/280)*10)*0.1)));
  if (active) return <View style={styles.lensPrompt}><Text style={styles.lensTitle}>{active[0]}</Text><Text style={styles.lensBody}>{active[1]}</Text><View style={styles.sliderTrack} onStartShouldSetResponder={()=>true} onResponderGrant={setFromTouch} onResponderMove={setFromTouch}><View style={[styles.sliderFill,{width:`${choice*10}%`}]}/><View style={[styles.sliderThumb,{left:`${choice*10}%`}]}/></View><View style={styles.sliderLabels}><Text style={styles.sliderLabel}>Not at all</Text><Text style={styles.sliderLabel}>Extremely</Text></View><TextInput value={note} onChangeText={setNote} placeholder="Add a note (optional)…" style={styles.lensInput}/><Pressable style={styles.saveLens} onPress={()=>{onSave(`${active[0]}${note?` — ${note}`:''}`,active[2],choice);close()}}><Text style={styles.saveLensText}>Save this check-in</Text></Pressable><Pressable onPress={close}><Text style={styles.lensClose}>Not right now</Text></Pressable></View>;
  return <View style={styles.lensGrid}>{activities.map(item => <Pressable key={item[0]} style={[styles.lensCard,{backgroundColor:item[3]}]} onPress={() => setActive(item)}><Text style={styles.lensTitleLight}>{item[0]}</Text><Text style={styles.lensBodyLight}>{item[1]}</Text><Text style={styles.lensTapLight}>Tap to check in →</Text></Pressable>)}</View>;
}
