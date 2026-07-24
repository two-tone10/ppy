import React from 'react';
import {View, Text} from 'react-native';

export default function SkyPreview({styles, moods=[]}) {
  return <View style={styles.skyPreview}><View style={styles.skyPreviewHeader}><Text style={styles.skyPreviewKicker}>OUR SKY</Text><Text style={styles.skyPreviewMeta}>{moods.length ? `${moods.length} shared signals` : 'Waiting for the group'}</Text></View><View style={styles.skyField}>{moods.length ? moods.map((m,i)=><Text key={i} style={[styles.skyPreviewDot,{left:`${Math.max(5,Math.min(90,m.x/4))}%`,top:`${Math.max(8,Math.min(82,m.y/4))}%`}]}>{i%3===0?'✦':'·'}</Text>) : <Text style={styles.skyPreviewHint}>Your group’s weather will appear here after five check-ins.</Text>}</View></View>;
}
