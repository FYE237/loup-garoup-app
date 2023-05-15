import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, ImageBackground} from "react-native";

import styles from "./inputModal.style";
import { GLOBAL_STYLES } from "../../../styles";
import {images, COLORS} from "../../../constants"
import { useState } from "react";



export default function InputModal({ visibleParam,
                                     visibleFunc,
                                     textInit,
                                     submitText,
                                     submitFunc, 
                                     inputValue, 
                                     inputValueFunc,
                                     imageUrl,
                                     styleArg,
                                     isImageBackground,
                                     title,
                                     testID,
                                     testIDValide
                                  }) { 
  
    return (
    <Modal
      visible={visibleParam}
      transparent={true}
      animationType="fade"
      onRequestClose={visibleFunc}
      >
      <View style={styles.modalContainer}>
        {isImageBackground ? (
          <ImageBackground source={imageUrl} style={GLOBAL_STYLES.background}>
          <ModalBody    
            visibleParam = {visibleParam}
            visibleFunc = {visibleFunc}
            textInit = {textInit}
            submitText = {submitText}
            submitFunc = {submitFunc} 
            inputValue = {inputValue} 
            inputValueFunc = {inputValueFunc}
            imageUrl = {imageUrl}
            styleArg = {styleArg}
            title = {title}
            testID={testID}
            testIDValide={testIDValide}/>
          </ImageBackground>
          ) 
        :           
        <ModalBody    
          visibleParam = {visibleParam}
          visibleFunc = {visibleFunc}
          textInit = {textInit}
          submitText = {submitText}
          submitFunc = {submitFunc} 
          inputValue = {inputValue} 
          inputValueFunc = {inputValueFunc}
          imageUrl = {imageUrl}
          styleArg = {styleArg}
          title = {title}
          testID={testID}
          testIDValide={testIDValide} />
        }
      </View>
    </Modal>
    );
};


const ModalBody =  ({ visibleParam,
  visibleFunc,
  textInit,
  submitText,
  submitFunc, 
  inputValue, 
  inputValueFunc,
  styleArg,
  title,
  testID,
  testIDValide
  }) => {
    const [textValue, setTextValue] = useState('');
    const [errorText, setErrorText] = useState('');
    return(
    <View style={styles.modalContent}>
    <View style={styles.headerModal}>
     <Text style={[GLOBAL_STYLES.textSmallTitle, {flex : 1}]}>{title}</Text>
     <TouchableOpacity onPress={visibleFunc}>
       <Text style={styles.closeButton}>X</Text>
     </TouchableOpacity>
    </View>
    <TextInput
      style={[styles.input, {color : "black"}]}
      onChangeText={(text) => setTextValue(text)}
      placeholder={textInit}
      value = {textValue}
      testID={testID}
    />
    <Text style = {GLOBAL_STYLES.textSmallWarn}> {errorText}</Text>
    <TouchableOpacity style={styles.buttonSubmit} onPress={()=> submitFunc ? submitFunc(textValue, setErrorText) : submitFunc}  testID={testIDValide}>
      <Text style={GLOBAL_STYLES.textModal}>{submitText}</Text>
    </TouchableOpacity>
  </View>)
}


