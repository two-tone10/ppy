import React from 'react';
import {View, Text, Image} from 'react-native';

const lens=[['tried','A chance to try','#ec735f'],['seen','Someone saw it','#8e607e'],['helped','What helped me','#4d8b80'],['other','The room made space','#35405a']];
const panels=[['purpose','What matters'],['scope','How far it reaches'],['orientation',"Where I'm headed"],['content','What I care about'],['tried','A chance to try'],['seen','Someone saw it'],['helped','What helped me'],['other','The room made space']];

export default function CompassPortrait({styles,signals=[],mood}) {
  const active=new Set(signals.map(s=>s.tag));
  return <><Text style={styles.eyebrow}>YOUR PORTRAIT · JUST YOURS</Text><Text style={styles.h2}>A picture of what{`\n`}<Text style={styles.italic}>helps you move.</Text></Text><Text style={styles.lede}>A daily canvas. Each panel appears when something real happens.</Text><View style={styles.panelPortrait}>{panels.map(([tag,label],i)=><View key={tag} style={[styles.portraitPanel,!active.has(tag)&&styles.portraitPanelHidden]}><Image source={require('../../assets/compass-splash.png')} style={[styles.panelArt,{left:`-${i*100}%`}]} /><View style={styles.panelShade}/>{!active.has(tag)&&<Text style={styles.panelLock}>·</Text>}</View>)}</View><Text style={styles.panelCaption}>{active.size ? `${active.size} of 8 parts revealed today` : 'Start with one moment to reveal a part of your portrait.'}</Text><View style={styles.portraitGrid}>{lens.map(([tag,name,color])=>{const entries=signals.filter(s=>s.tag===tag);return <View key={tag} style={[styles.portraitLens,{borderLeftColor:color}]}><Text style={[styles.portraitLensDot,{color}]}>●</Text><View><Text style={styles.portraitLensName}>{name}</Text><Text style={styles.portraitLensMeta}>{entries.length ? entries[0].body : 'Waiting for a moment'}</Text></View></View>})}</View>{mood&&<Text style={styles.portraitFooter}>Your latest weather check is part of the picture, too.</Text>}</>;
}
