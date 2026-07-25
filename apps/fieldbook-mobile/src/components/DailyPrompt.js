import React from 'react';
import {View, Text, Pressable} from 'react-native';

const prompts=[
  ['TODAY\'S SMALL QUESTION','Did you get a real chance to try, make, lead, or explore something today?','tried'],
  ['TODAY\'S SMALL QUESTION','Did someone notice or name something you brought today?','seen'],
  ['TODAY\'S SMALL QUESTION','What person, place, tool, time, or permission helped today?','helped'],
  ['TODAY\'S SMALL QUESTION','Did the room make space for your ideas or culture today?','other'],
];
export default function DailyPrompt({styles,onChoose}) { const p=prompts[new Date().getDate()%prompts.length]; return <View style={styles.dailyPrompt}><Text style={styles.dailyKicker}>{p[0]}</Text><Text style={styles.dailyQuestion}>{p[1]}</Text><Pressable style={styles.dailyButton} onPress={()=>onChoose(p[2])}><Text style={styles.dailyButtonText}>Check in →</Text></Pressable></View>; }
