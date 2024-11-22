import { Avatar, Card, List, Text, Button, FlatList } from "react-native-paper";
import axios from "axios";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { BASE_URL, API_URL } from "@env";
import { firebase } from "../config";
import AddCarbsModal from "../ui/addCarbsModal";


const Beforefoodscreen = ({ navigation, route }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const user = useSelector(state => state.user);
  const [userDates, setUserDates] = useState([]);
  const [userMealData, setUserMealData] = useState([]);
  const [bloodGlucoseBeforeMeal, setBloodGlucoseBeforeMeal] = useState(0)
  const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [bloodGlucoseData = [], setBloodGlucoseData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const handlePress = () => setExpanded(!expanded);
  const [readings, setReadings] = useState([]);  // State to store readings
  const [error, setError] = useState(null);


  useEffect(() => {
    if (isFocused) {
      console.log("User Id: ", user);
      const fetchUserDates = async () => {
        axios.get(`${API_URL}/api/userDates`, {
          params: {
            userId: user?.user?.uid,
          },
        }).then(res => {
          console.log("Dates: ", res);
          setUserDates(res.data);
        }).catch(err => console.log("Err: ", err));
      };
      fetchUserDates();
    }
  }, [isFocused, user]);

  // useEffect( () => { 

  //   // Fetch readings from the backend (replace with your actual API call)
  //  const response=  getBloodGlucoseBeforeMealByUserId()
  //  console.log("blood==>", response); 
  // setBloodGlucoseData(response)});
  //     .then(fetchBloodGlucoseData =>{
  //       console.log("blood==>", fetchBloodGlucoseData); 
  //       setBloodGlucoseData(fetchBloodGlucoseData)})
  //     .catch(error => console.error('Error fetching readings:', error));
  // }, []

  // const handleDaySelect = day => {
  //   if (selectedDay === day) {
  //     setSelectedDay(null);
  //   } else {
  //     setSelectedDay(day);
  //     console.log("Day: ", day);
  //     axios.get(`${API_URL}/api/getDataByDate`, {
  //       params: {
  //         userId: user?.user?.uid,
  //         mealDate: new Date().toLocaleDateString('en-GB'),
  //       },
  //     }).then(res => {
  //       console.log("Data: ", res);
  //       setUserMealData(res.data);
  //     }).catch(err => console.log("err: ", err));
  //   }
  // };


  // const handleDaySelect = (day) => {
  //   if (selectedDay === day) {
  //     setSelectedDay(null);
  //     setBloodGlucoseBeforeMeal([]); // Clear displayed data on deselection
  //   } else {
  //     setSelectedDay(day);
  //     console.log("Selected Day: ", day);
  //     getBloodGlucoseBeforeMealByUserId(user?.user?.uid, day); // Fetch data for selected day
  //   }
  // };


  const parseDate = dateStr => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  }

  const formatDate = dateStr => parseDate(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fetchBloodGlucoseBeforeMeal = async (userId, mealDate) => {
    axios.get(`${API_URL}/api/getAllBloodGlucoseBeforeMeal`, {
      params: {
        userId,
        mealDate,
      },
    }).then(response => {
      console.log("Response from getAllBloodGlucoseBeforeMeal: ", response.data);
      setBloodGlucoseBeforeMeal(response.data);
    }).catch(error => console.log("Error fetching blood glucose before meal: ", error));
  };

  const getBloodGlucose = (bloodGlucoseData, mealType) => {
    const data = bloodGlucoseData.find(data => data.mealType === mealType);
    return data?.bloodGlucoseBeforeMeal;
  }

  const handleSaveBloodGlucoseBeforeMeal = (data) => {
    addBloodGlucoseBeforeMeal(data);
    setModalVisibleBeforeMeal(false);
  };



  const addBloodGlucoseBeforeMeal = async (data) => {
    let params = {
      userId: user?.user?.uid,
      // mealType: mealType,
      bloodGlucoseBeforeMeal: data,
      //bloodglucoseentryTime: new Date().toLocaleDateString("en-GB"),
    };
    setLoading(true);
    console.log("This the data we are saving for blood glucose:\n", params)
    await axios
      .post(
        `${API_URL}/api/addBloodGlucoseBeforeMeal`, params
      )
      .then(res => {
        console.log("Blood Glucose Before Meal API Response: ", res);
        setLoading(false);
        navigation.goBack();
      })
      .catch(e => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };

  const getBloodGlucoseBeforeMealByUserId =  () => {
    let params = {
      userId: user?.user?.uid,
      // mealType: mealType,
      // bloodGlucoseBeforeMeal: data,
      //bloodglucoseentryTime: new Date().toLocaleDateString("en-GB"),
    };
    // setLoading(true);
    console.log("This the data we are saving for blood glucose1:\n", params)
    console.log("URL=====>", API_URL);
    axios
      .get(
        // `${API_URL}/api/getBloodGlucoseBeforeMealByUserId`, params
        `http://localhost:8083/api/getBloodGlucoseBeforeMealByUserId?userId=6yy8zfYvkjRPCyxvSkILiOjrcJ73`
      )
      .then(res => {
        console.log("Blood Glucose Before Meal API Response: ", res);
        // setLoading(false);
        // navigation.goBack();
        return res.data;
      })
      .catch(e => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };


  // useEffect(() => {
  //   const fetchReadings = async () => {
  //     try {
  //       const data = await getBloodGlucoseBeforeMealByUserId();// Call your API or function
  //       console.log('Fetched Data:', data); // Debugging output
  //       setReadings(data || []); // Safely handle null or undefined
  //     } catch (error) {
  //       console.error('Error fetching readings:', error);
  //     } finally {
  //       setLoading(false); // Set loading to false once done
  //     }
  //   };

  //   fetchReadings();
  // }, []);

  // // Render a loading state if data is still being fetched
  // if (loading) {
  //   return <p>Loading...</p>;
  // }



  useEffect(() => {
    const fetchReadings = async () => {
        try {
            const response = await fetch('http://localhost:8083/api/getBloodGlucoseBeforeMealByUserId?userId=OhVZ2nF6zgOQ91falYhRHQxSPk62');
            console.log("response===>", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("data1===>", data);
            setReadings(data);
            console.log("setReadings1===>",readings);
             console.log("setReadings===>",readings.bloodGlucoseBeforeMeal );
        } catch (error) {
            console.error('Error fetching readings:', error);
            setError(error.message);
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    fetchReadings();
}, []);






  // const getBloodGlucoseBeforeMealByUserId = async (userId, mealDate) => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`${API_URL}/api/getBloodGlucoseBeforeMealByUserId`, {
  //       params: { userId, mealDate },
  //     });
  //     console.log("Blood Glucose Data for Selected Day: ", response.data);
  //     setBloodGlucoseBeforeMeal(response.data || []);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error fetching blood glucose data: ", error);
  //     setLoading(false);
  //   }
  // };


  const fetchUserDates = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/userDates`, {
        params: { userId: user?.user?.uid },
      });
      console.log("User Dates: ", res.data);
      setUserDates(res.data);
    } catch (err) {
      console.log("Error fetching user dates: ", err);
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Carbs Consumption History</Text> */}
      <List.Section>
        {/* <List.Subheader style={styles.subheader}>Select a day to view carbs consumption:</List.Subheader> */}
        <View style={{ marginTop: 16 }} />
        {/* {["Breakfast","Lunch","Dinner"].map(mealType => (
          <List.Accordion
            key={mealType}
            title={mealType}
            titleStyle={styles.accordionTitle}
           expanded={selectedDay === mealType}
            onPress={() => {
              handleDaySelect(mealType);
              fetchBloodGlucoseBeforeMeal(firebase.auth().currentUser.uid, new Date().toLocaleDateString("en-GB"));
            }}
            style={[styles.accordionItem, selectedDay === mealType && styles.selectedItem]}
            left={props => <Avatar.Icon {...props} icon="calendar" style={styles.icon} color="white" />}
          > */}
        <Button
          mode="contained"
          onPress={() => setModalVisibleBeforeMeal(true)}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Add Blood Glucose Reading Before Meal
        </Button>

        <AddCarbsModal
          visible={modalVisibleBeforeMeal}
          placeholder={"Enter the reading Before Meal"}
          onDismiss={() => setModalVisibleBeforeMeal(false)}
          onSave={bloodGlucose => handleSaveBloodGlucoseBeforeMeal(bloodGlucose)}
        />
        <List.Section>
          <List.Accordion
            title="Today's Readings"
            // left={props => <Avatar.Icon {...props} icon="calendar" />}
            // expanded={expanded} onPress={handlePress}    
               >
            {readings.map((reading, index) => (
              
              // <List.Item()
              //   key={index}
              //   title={`Reading ${index + 1}`}
                // description={`Value: ${reading.bloodGlucoseBeforeMeal}`}
                // left={props => <List.Icon {...props} icon="thermometer" />} />
                <tr>              <td>{reading.bloodGlucoseBeforeMeal}</td>     <td>{reading.bloodglucoseentryTime}</td>         </tr> 
                ))} 
                
          </List.Accordion>
        </List.Section>




{/* <div>
            <h1>Before Food Readings</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : readings && readings.bloodGlucoseBeforeMeal ? (
            
                <table>
                    <thead>
                        <tr>
                            <th>Blood Glucose Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{readings[0].bloodGlucoseBeforeMeal}</td> 
                            <td>{readings[0].bloodglucoseentryTime}</td> 
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No readings available</p>
            )}
        </div> */}




{/* <div>
            <h1>Before Food Readings</h1>
            <h1>(readings.bloodGlucoseBeforeMeal)</h1>
        </div> */}




        {/* <List.Section>
          <List.Accordion title="Today's Readings">
            {readings.length > 0 ? (
              readings.map((reading, index) => (
                <tr key={index}>
                  <td>{reading.bloodGlucoseBeforeMeal}</td>
                </tr>
              ))
            ) : (
              <p>No readings available</p>
            )}
          </List.Accordion>
        </List.Section> */}
        


        {/* {selectedDay === mealType && (
              <View style={[styles.mealRow, { marginTop: 16 }]}> */}
        {/* {userMealData.map(mealData => (
                  <Card key={mealData._id} style={styles.card}>
                    <Card.Content>
                       <Text style={styles.mealText}>
                        {mealData?.mealType} : {mealData?.totalCarbs.toFixed(2)} Carbs Taken
                      </Text>
                      <Text style={styles.mealText}>
                        Insulin Dose Taken : {mealData?.insulinDose} units
                      </Text>
                      <Text style={styles.mealText}>
                        {bloodGlucoseBeforeMeal ? (
                          `Blood Glucose before ${mealData?.mealType} : ${getBloodGlucose(bloodGlucoseBeforeMeal, mealData?.mealType)} mmol/L`
                        ) : (
                          `Blood Glucose before ${mealData?.mealType} : No data available`
                        )}
                      </Text> 
                       <Text style={styles.mealText}>
                        {mealData?.bloodGlucoseLevel ? (
                          `Blood Glucose After ${mealData?.mealType} : ${mealData?.bloodGlucoseLevel} mmol/L`
                        ) : (
                          `Blood Glucose After ${mealData?.mealType} : No data available`
                        )}
                      </Text> 
                    </Card.Content>
                  </Card>
                ))} */}
        {/* </View>
            )}
          </List.Accordion>
        ))} */}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: '#333333',
  },
  subheader: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 8,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#333333',
  },
  accordionItem: {
    marginVertical: 4,
  },
  selectedItem: {
    backgroundColor: "#e0f7fa",
  },
  mealText: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 8,
  },
  icon: {
    backgroundColor: '#2A6BBF',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    marginHorizontal: 8,
    minWidth: '30%',
  },
  mealRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 16, // Space above the tiles
  },
});

export default Beforefoodscreen;
