import React, { useEffect, useState,useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import  io from "socket.io-client";
import { Switch } from 'react-native-elements';
import { Icon } from 'react-native-elements'
import { Button, Overlay,Input } from 'react-native-elements';
const URL="http://localhost:5000/";
export default function App() {
  const [STATE,setState]=useState({
    state:0,
    hOff:0,
    mOff:0
  })
  const [overlay,setOverlay]=useState(false)
  const socket=useRef()
  useEffect(()=>{
    socket.current=io(URL)
    socket.current.on('server-send-state',data=>{
      setState(STATE=>({...STATE,state:data}))
    })
    socket.current.on('server-send-hOff',data=>{
      setState(STATE=>({...STATE,hOff:data}))
    })
    socket.current.on('server-send-mOff',data=>{
      setState(STATE=>({...STATE,mOff:data}))
    })
  },[])
  const toggleState=()=>{
    const data={}
    if(STATE.state==1){
      data.state=0
    }else{
      data.state=1
    }
    socket.current.emit('client-send-state',data)
  }

  const increaseHours=()=>{
    console.log('in gio')

    if(STATE.hOff==23){
      socket.current.emit('client-send-hOff',{hOff:0})
    }else{
      socket.current.emit('client-send-hOff',{hOff:STATE.hOff+1
    })
    }
  }

  const decreaseHours=()=>{
    console.log('de gio')

    if(STATE.hOff==0){
      socket.current.emit('client-send-hOff',{hOff:0})
    }else{
      socket.current.emit('client-send-hOff',{hOff:STATE.hOff-1
    })
    }
  }

  const increaseMinutes=()=>{
    if(STATE.mOff==59){
      socket.current.emit('client-send-mOff',{mOff:0})
    }else{
      socket.current.emit('client-send-mOff',{mOff:STATE.mOff+1})
    }
  }

  const decreaseMinutes=()=>{
    console.log('de phut')
    if(STATE.mOff==0){
      socket.current.emit('client-send-mOff',{mOff:0})
    }else{
      socket.current.emit('client-send-mOff',{mOff:STATE.mOff-1})
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.content_row}>
        <Text style={{marginBottom:'50px'}}>Trạng thái</Text> 
        <Switch style={{marginLeft:'40px',marginBottom:"50px"}} value={STATE.state?true:false}  onClick={toggleState} />
      </View>
      <View style={styles.content_row}>
        <Text >Time Off:</Text>
        <View>
          <Icon name='caret-up-outline' type='ionicon' size={20} style={{marginLeft:'16px'}} onPress={increaseHours}/>
            <Text style={{marginLeft:'20px'}} >{STATE.hOff}</Text>
          <Icon name='caret-down-outline' type='ionicon' size={20} style={{marginLeft:'16px'}} onPress={decreaseHours}/>
        </View>
        <Text style={{marginLeft:'10px'}}>:</Text>
        <View>
          <Icon name='caret-up-outline' type='ionicon' size={20} style={{marginLeft:'16px'}} onPress={increaseMinutes} />
            <Text style={{marginLeft:'20px'}} >{STATE.mOff}</Text>
          <Icon name='caret-down-outline' type='ionicon' size={20} style={{marginLeft:'16px'}} onPress={decreaseMinutes}/>
        </View>
      </View> 
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_row:{
    flexDirection:"row",
    justifyContent: 'center',
    alignItems: 'center',
  },  
});
