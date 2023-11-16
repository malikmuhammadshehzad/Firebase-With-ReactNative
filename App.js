import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//  import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
const App = () => {
  // Cloud Firebase Database

  // const [ myData, setMyData] = useState(null)
  // useEffect(() => {
  //   getDatabase()
  // }, [ ])
  // const getDatabase =async ()=>{
  //   try {
  //     const  data = await firestore().collection('testing').doc('41QLcwhsyHkzh2rxmhJ6').get()
  //     // console.log('userData' , data._data);
  //     setMyData(data._data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // console.log( "myData" ,  myData);

  // RealTime Database
  const [inputText, setInputText] = useState(null);
  const [list, setList] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCartIndex, setSelectedCartIndex] = useState(null);

  useEffect(() => {
    userData();
  }, []);
  const userData = async () => {
    try {
      // const data = await database().ref('todo').once('value');
      const data = await database()
        .ref('todo')
        .on('value', tempData => {
          // console.log('Database: ', data);
          setList(tempData.val());
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Todo List

  const handleAddData = async () => {
    try {
      // if (inputText > 0) {
      //   const index = list.length;
      //   const response = await database().ref(`todo/${index}`).set({
      //     value: inputText,
      //   });
      //   // console.log('response: ', response.todo);
      //   setInputText(null);
      // } 
      const index = list.length;
      const response = await database().ref(`todo/${index}`).set({
        value: inputText,
      });
      // console.log('response: ', response.todo);
      setInputText(null);
      // else {
      //   Alert.alert('Enter your Todo List ');
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
   
        await database().ref(`todo/${selectedCartIndex}`).update({
          value: inputText,
        });
        setInputText(null);
        setIsUpdate(false);
       
      // else {
      //   Alert.alert('Enter your value');
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCartPress = async (item, index) => {
    try {
      setIsUpdate(true);
      setSelectedCartIndex(index);
      setInputText(item.value);
      console.log('index:', index);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLongPress = (item, index) => {
    try {
      Alert.alert( 'Alert' , `Are you Sure to Delete ${item.value}`, [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel is Press');
          },
        },
        {
          text: 'Ok',
          onPress: async() => {
             try {
              const response = database().ref(`todo/${index}`).remove()
              console.log(index);
             } catch (error) {
              console.log(error)
             }
          },
        },
      ]);
      // setIsUpdate(true);
      // setSelectedCartIndex(index);
      // setInputText(item.value);
      // console.log('index:', index);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.TodoContainer}>
        <TextInput
          style={styles.input}
          placeholder="Todo List"
          value={inputText}
          onChangeText={text => setInputText(text)}
        />
        {isUpdate ? (
          <TouchableOpacity onPress={handleUpdate} style={styles.addContainer}>
            <Text style={styles.addButton}>update</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleAddData} style={styles.addContainer}>
            <Text style={styles.addButton}> Add </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={list}
        renderItem={({item, index}) => {
          console.log( " index: ",index );
          if (item !== null) {
            // console.log(item.value);
            return (
              <TouchableOpacity
                style={styles.listContainer}
                onLongPress={() => handleLongPress(item, index)}
                onPress={() => handleCartPress(item, index)}>
                <Text style={styles.todo}>{item.value}</Text>
              </TouchableOpacity>
            );
          }
        }}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 12,
    marginTop: 22,
    padding: 12,
  },
  TodoContainer: {
    flexDirection: 'row',
  },
  input: {
    borderRadius: 12,
    borderColor: 'black',
    borderWidth: 0.9,
    width: '83%',
    padding: 8,
    backgroundColor: '#F7D9D0',
    height: 50,
    fontSize: 22,
  },
  addContainer: {
    justifyContent: 'center',
    marginLeft: 12,
    backgroundColor: '#FBCEC0',
    borderRadius: 12,
    padding: 3,
    alignItems: 'center',
    borderWidth: 0.9,
    height: 51,
  },
  addButton: {
    fontSize: 18,
    color: 'black',
  },
  listContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7D9D0',
    marginTop: 12,
    borderRadius: 7,
    padding: 12,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginTop: 120,
  },
  todo: {
    width: '75%',
    fontSize: 22,
    color: 'black',
  },
  iconContainer: {
    width: '23%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
