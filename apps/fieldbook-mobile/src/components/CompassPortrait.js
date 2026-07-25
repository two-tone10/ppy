import React from 'react';
import {View, Text, ImageBackground} from 'react-native';

const lens = [
  ['tried','Practice','coral','#ec735f'],
  ['seen','Recognition','plum','#8e607e'],
  ['helped','Support','teal','#4d8b80'],
  ['other','Belonging','navy','#35405a'],
];

export default function CompassPortrait({styles, signals=[], mood}) {
  return <><Text style={styles.eyebrow}>YOUR PORTRAIT · JUST YOURS</Text><Text style={styles.h2}>A picture of what{`\n`}<Text style={styles.italic}>helps you move.</Text></Text><Text style={styles.lede}>Not a score. A living snapshot built from the moments you choose to keep.</Text><ImageBackground source={require('../../assets/compass-splash.png')} imageStyle={styles.portraitImage} style={styles.portraitHero}><Text style={styles.portraitStar}>✦</Text><Text style={styles.portraitHeroText}>{signals.length ? `${signals.length} signals noticed` : 'Your portrait is just beginning'}</Text></ImageBackground><View style={styles.portraitGrid}>{lens.map(([tag,name,_,color])=>{const count=signals.filter(s=>s.tag===tag).length;return <View key={tag} style={[styles.portraitLens,{borderLeftColor:color}]}><Text style={[styles.portraitLensDot,{color}]}>●</Text><View><Text style={styles.portraitLensName}>{name}</Text><Text style={styles.portraitLensMeta}>{count ? `${count} moment${count===1?'':'s'} here` : 'Waiting for a moment'}</Text></View></View>})}</View>{mood&&<Text style={styles.portraitFooter}>Your latest weather check is part of the picture, too.</Text>}</>;
}
