// import { StyleSheet, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { ActivityIndicator, Button, Divider, IconButton, List, Text, Tooltip, useTheme } from "react-native-paper";
// import AddCarbsModal from "../ui/addCarbsModal";
// import { firebase } from "../config";
// import { useIsFocused } from '@react-navigation/native';
// import { BASE_URL } from "@env"
// // import { bloodGlucoseBefore } from "../../DiabeticApp-backend/controller/userCarbsDataController";

// const ViewFoodItem = ({ navigation, route }) => {
//   const theme = useTheme();

//   const dispatch = useDispatch();
//   const isFocused = useIsFocused();
//   const user = useSelector(state => state.user);
//   const { tag } = route?.params;
//   const [objectId, setObjectId] = useState(null);
//   const [foodItems, setFoodItems] = useState([]);
//   const [totalCarbs, setTotalCarbs] = useState("");
//   const [insulinDose, setInsulinDose] = useState(0);
//   const [userCRR, setUserCRR] = useState(0);
//   const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState(0);
//   const [targetBloodGlucose, setTargetBloodGlucose] = useState(0);
//   const [bloodGlucoseLevelBeforeMeal, setBloodGlucoseLevelBeforeMeal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
//   const [modalVisibleAfterMeal, setModalVisibleAfterMeal] = useState(false);
//   const [userICR, setUserICR] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = firebase.auth().currentUser;

//       if (user) {
//         const userId = user.uid;
//         const userProfRef = firebase.firestore()
//           .collection("userProfile")
//           .doc(userId);

//         const userProf = await userProfRef.get();

//         if (userProf.exists) {
//           const userProfData = userProf.data();
//           setTargetBloodGlucose(userProfData.targetBloodGlucose);
//         } else {
//           console.log("User profile data not found.");
//         }
//       } else {
//         console.log("No user is currently logged in.");
//       }
//     };
//     fetchUserData();
//   });

//   const [userStateData, setUserStateData] = useState({});
//   const [weight, setWeight] = useState("");
//   const [height, setHeight] = useState("");
//   const [age, setAge] = useState("");
//   const [breakfastStartHour, setBreakfastStartHour] = useState({});
//   const [breakfastEndHour, setBreakfastEndHour] = useState({});
//   const [lunchStartHour, setLunchStartHour] = useState({});
//   const [lunchEndHour, setLunchEndHour] = useState({});
//   const [dinnerStartHour, setDinnerStartHour] = useState({});
//   const [dinnerEndHour, setDinnerEndHour] = useState({});
//   const [bfICR, setBfICR] = useState("");
//   const [lhICR, setLhICR] = useState("");
//   const [dnICR, setMICR] = useState("");
//   const [crr, setCRR] = useState("");
//   const [showSummary, setShowSummary] = useState(false);

//   useEffect(() => {
//     if (isFocused) {
//       const fetchUserData = async () => {
//         const user = firebase.auth().currentUser;

//         if (user) {
//           const userId = user.uid;
//           const userDocRef = firebase.firestore()
//             .collection("users")
//             .doc(userId);
//           const userProfRef = firebase.firestore()
//             .collection("userProfile")
//             .doc(userId);

//           const userDoc = await userDocRef.get();
//           const userProf = await userProfRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             setUserStateData(userData);
//             dispatch({
//               type: "userData",
//               payload: { userData },
//             });
//           } else {
//             console.log("User data not found.");
//           }

//           if (userProf.exists) {
//             const userProfData = userProf.data();
//             setWeight(userProfData.weight);
//             setHeight(userProfData.height);
//             setAge(userProfData.age);
//             setBreakfastStartHour(userProfData.breakfastStartHour);
//             setBreakfastEndHour(userProfData.breakfastEndHour);
//             setLunchStartHour(userProfData.lunchStartHour);
//             setLunchEndHour(userProfData.lunchEndHour);
//             setDinnerStartHour(userProfData.dinnerStartHour);
//             setDinnerEndHour(userProfData.dinnerEndHour);
//             setBfICR(userProfData.bfICR);
//             setLhICR(userProfData.lhICR);
//             setMICR(userProfData.dnICR);
//             setCRR(userProfData.crr);
//             setTargetBloodGlucose(userProfData.targetBloodGlucose);
//           } else {
//             console.log("User profile data not found.");
//           }
//         } else {
//           console.log("No user is currently logged in.");
//         }
//       };
//       fetchUserData();
//     }
//   }, [isFocused]);

//   const getUpdatedUserICR = async () => {
//     console.log("HER: ", user?.user?.uid, tag);
//     await axios
//       .get(`${BASE_URL}/api/updateUserICR`, {
//         params: {
//           userId: user?.user?.uid,
//           mealType: tag,
//         },
//       })
//       .then(res => {
//         console.log("Response from Update ICR: ", res);
//         setUserICR(res.data);
//       })
//       .catch(err => console.log("Err: ", err));
//   };

//   const getFoodItems = async () => {
//     let params = {
//       userId: user?.user?.uid,
//       mealType: tag,
//     };
//     setLoading(true);
//     await axios.get(`${BASE_URL}/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`)
//       .then(res => {
//         setLoading(false);
//         setFoodItems(res?.data ? res?.data?.mealItems : []);
//         setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
//         setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
//         setObjectId(res?.data ? res?.data?._id : null);
//         setBloodGlucoseLevel(
//           res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
//         );
//         setTargetBloodGlucose(
//           res?.data?.targetBloodGlucose ? res?.data?.targetBloodGlucose : 0
//         )
//         // setBloodGlucoseLevelBeforeMeal(
//         //   res?.data?.bloodGlucoseLevelBeforeMeal ? res?.data?.bloodGlucoseLevelBeforeMeal : 0
//         // );
//         setUserCRR(res?.data?.userCRR);
//         console.log("This is the data: ", res.data)
//         console.log("This is crr: ", res?.data?.userCRR);
//         console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);
//         console.log("Data: ", res, res?.data ? res?.data?.mealItems : []);
//       }).catch(e => {
//         setLoading(false);
//         console.log("Error: ", e);
//       });
//   };

//   const addBloodGlucose = async data => {
//     let params = {
//       _id: objectId,
//       bloodGlucoseLevel: data,
//     };
//     setLoading(true);
//     await axios
//       .put(
//         `${BASE_URL}/api/addBloodGlucose`,
//         params
//       )
//       .then(res => {
//         setLoading(false);
//         navigation.goBack();
//       })
//       .catch(e => {
//         setLoading(false);
//         console.log("Error: ", e);
//       });
//   };

//   const addBloodGlucoseBeforeMeal = async data => {
//     let params = {
//       userId: user?.user?.uid, // set user id because it is not saved
//       mealType: tag,
//       bloodGlucoseBeforeMeal: data,
//     };
//     setLoading(true);
//     console.log("This the data we are saving for blood glucose:\n", params)
//     await axios
//       .post(
//         `${BASE_URL}/api/addBloodGlucoseBeforeMeal`,
//         params
//       )
//       .then(res => {
//         console.log("Blood Glucose Before Meal API Response: ", res);
//         // setBloodGlucoseLevelBeforeMeal(res?.data?.bloodGlucoseBeforeMeal ? res?.data?.bloodGlucoseBeforeMeal : 0);
//         setLoading(false);
//         navigation.goBack();
//       })
//       .catch(e => {
//         setLoading(false);
//         console.log("Error : ", e);
//       });
//   };

//   const getBloodGlucoseBeforeMeal = async () => {
//     let params = {
//       userId: user?.user?.uid,
//       mealType: tag,
//     };
//     setLoading(true);
//     await axios.get(`${BASE_URL}/api/getBloodGlucoseBeforeMeal?userId=${params.userId}&mealType=${params.mealType}&mealDate=${new Date().toLocaleDateString('en-GB')}`)
//       .then(res => {
//         setLoading(false);
//         // setFoodItems(res?.data ? res?.data?.mealItems : []);
//         // setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
//         // setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
//         // setObjectId(res?.data ? res?.data?._id : null);
//         // setBloodGlucoseLevel(
//         //   res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
//         // );
//         // setTargetBloodGlucose(
//         //   res?.data?.targetBloodGlucose ? res?.data?.targetBloodGlucose : 0
//         // )
//         setBloodGlucoseLevelBeforeMeal(
//           res?.data?.bloodGlucoseBeforeMeal ? res?.data?.bloodGlucoseBeforeMeal : 0
//         );
//         console.log("Getting data: ", res);
//         console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);

//       })
//       .catch(e => {
//         setLoading(false);
//         console.log("Error: ", e);
//       });
//   };

//   // const addBloodGlucoseBeforeMeal = async data => {
//   //   console.log("HER: ", user?.user?.uid, tag);
//   //   await axios
//   //     .put(`${BASE_URL}/api/addBloodGlucoseBeforeMeal`, {
//   //       params: {
//   //         userId: user?.user?.uid,
//   //         mealType: tag,
//   //       },
//   //     })
//   //     .then(res => {
//   //       console.log("Res: ", res);
//   //       setBloodGlucoseLevelBeforeMeal(data);
//   //     })
//   //     .catch(err => {
//   //       console.log("Err: ", err);
//   //     });
//   // };
//   useEffect(() => {
//     getUpdatedUserICR();
//     getBloodGlucoseBeforeMeal();
//     getFoodItems();
//   }, []);

//   const handleSaveBloodGlucose = data => {
//     addBloodGlucose(data);
//     setModalVisibleAfterMeal(false);
//     setBloodGlucoseLevel(data);
//     console.log("Target: ", targetBloodGlucose, " Blood Glucose: ", bloodGlucoseLevel);
//   };

//   const handleSaveBloodGlucoseBeforeMeal = data => {
//     addBloodGlucoseBeforeMeal(data);
//     setModalVisibleBeforeMeal(false);
//     //setBloodGlucoseLevelBeforeMeal(data);
//   };

//   const getCarbs = item => {
//     let carbs = 0;
//     carbs = item.foodNutrients.find(y => {
//       return parseInt(y.number) === 205;
//     });
//     return carbs ? carbs.amount : 0;
//   };

//   const onAddFood = () => navigation.navigate("FoodSearch", { tag, fromEditMeal: false });

//   const updateUserICR = async () => {
//     console.log("Update UserICR");
//     try {
//       const user = firebase.auth().currentUser;
//       if (user) {
//         const userId = user.uid;
//         const userDocRef = firebase
//           .firestore()
//           .collection("userProfile")
//           .doc(userId);
//         let data = {};
//         if (tag === "Breakfast") {
//           data = {
//             bfICR: userICR,
//           };
//         } else if (tag === "Lunch") {
//           data = {
//             lhICR: userICR,
//           };
//         } else {
//           data = {
//             dnICR: userICR,
//           };
//         }
//         await userDocRef.set(data, { merge: true });
//         console.log("Data to Deliver: ", data);
//         alert("Updated successfully");
//       } else {
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const RightListView = ({ item }) => (
//     <View>
//       <Text>Quantity: {item?.count}</Text>
//     </View>
//   );

//   const getCorrectionFactor = () => {
//     try {
//       console.log(`Blood Glucose Level: ${bloodGlucoseLevel}`);
//       console.log(`Target Blood Glucose: ${targetBloodGlucose}`);
//       console.log('User CRR: ', userCRR);
//       const x = (bloodGlucoseLevel - targetBloodGlucose) / userCRR;
//       // Round to the nearest half
//       return Math.round(x * 2) / 2;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {showSummary ? (
//         <List.Section style={styles.listSection}>
//           <List.Subheader>
//             {" "}
//             <Text style={styles.message}>Today's {tag}</Text>
//           </List.Subheader>
//           {foodItems?.map((item, index) => (
//             <List.Item
//               key={index}
//               titleEllipsizeMode="tail"
//               titleNumberOfLines={5}
//               title={item.description}
//               description={`Carbs: ${getCarbs(item)}`}
//               right={() => <RightListView item={item} />}
//             />
//           ))}
//         </List.Section>
//       ) : (
//         <View style={styles.emptyCartContainer}>
//           {loading ? (
//             <ActivityIndicator size="large" style={styles.activityIndicator} />
//           ) : (
//             <>
//               {foodItems.length > 0 && (
//                 <Text style={styles.message}>Food is already added. Check summary for more details.</Text>
//               )}

//               {bloodGlucoseLevelBeforeMeal === 0 && (
//                 <Button
//                   mode="contained"
//                   onPress={() => setModalVisibleBeforeMeal(true)}
//                   style={styles.button}
//                   labelStyle={{
//                     fontSize: 12,
//                     fontWeight: "bold"
//                   }}
//                 >
//                   Add Blood Glucose Reading Before Meal
//                 </Button>
//               )}
//               <AddCarbsModal
//                 visible={modalVisibleBeforeMeal}
//                 placeholder={"Enter the reading Before Meal"}
//                 onDismiss={() => setModalVisibleBeforeMeal(false)}
//                 onSave={handleSaveBloodGlucoseBeforeMeal}
//               />

//               {foodItems.length <= 0 && (
//                 <>
//                   {/* <Text style={styles.message}>You have no Food Items!!</Text> */}
//                   <Button
//                     mode="contained"
//                     onPress={onAddFood}
//                     style={styles.button}
//                     labelStyle={{
//                       fontSize: 12,
//                       fontWeight: "bold"
//                     }}
//                   >
//                     Add Food Here
//                   </Button>
//                 </>
//               )}
//               <Button
//                 mode="contained"
//                 onPress={() => setShowSummary(!showSummary)}
//                 style={styles.button}
//                 labelStyle={{
//                   fontSize: 12,
//                   fontWeight: "bold"
//                 }}
//               >
//                 Summary For Meal
//               </Button>
//               {/* <Text style={styles.messageICR}>After food intake please press for your dose !!</Text>
//                 <Button
//                 mode="contained"
//                 onPress={updateUserICR}
//               style={styles.button}
//               >
//             {userICR}
//             </Button> */}
//             </>
//           )}
//         </View>
//       )}
//       <Divider />
//       {showSummary ? (
//         <View style={styles.view}>
//           <Text variant="titleMedium">
//             Your ICR as per the records -
//             {bfICR ? ` Breakfast ICR - ${bfICR}` : ''}
//             {lhICR ? `, Lunch ICR - ${lhICR}` : ''}
//             {dnICR ? `, Dinner ICR - ${dnICR}` : ''}
//             {crr ? `, Correction Ratio - ${crr}` : ''}
//           </Text>

//           {totalCarbs > 0 ?
//             (
//               <Text variant="titleMedium">
//                 Total Carbs Consumed - {Number(totalCarbs).toFixed(2)} g
//               </Text>
//             ) : null}

//           {insulinDose > 0 ? (
//             <Text variant="titleMedium">
//               Total Insulin Dose - {insulinDose} units

//             </Text>
//           ) : null}

//           {bloodGlucoseLevelBeforeMeal ? (

//             <View variant="titleMedium" style={{ flexDirection: "row", alignItems: "center" }}>
//               <Text
//                 variant="titleMedium"
//                 style={{ marginRight: 25 }}
//               >
//                 Total Blood Glucose Level Before Meal - {bloodGlucoseLevelBeforeMeal} mmol/L
//               </Text>

//               <Tooltip title="Edit" leaveTouchDelay={1000}>
//                 <IconButton
//                   icon="pencil"
//                   onPress={() => setModalVisibleBeforeMeal(true)}
//                   iconColor={theme.colors.primary}
//                   size={15}
//                   style={{ margin: "-14px" }}
//                 />
//               </Tooltip>
//             </View>
//           ) : null}
//           <AddCarbsModal
//             visible={modalVisibleBeforeMeal}
//             placeholder={"Edit Blood Glucose Reading Before Meal"}
//             onDismiss={() => setModalVisibleBeforeMeal(false)}
//             onSave={handleSaveBloodGlucoseBeforeMeal}
//           />

//           {bloodGlucoseLevel > 0 ? (
//             <View variant="titleMedium" style={{ flexDirection: "row", alignItems: "center" }}>
//               <Text
//                 variant="titleMedium"
//                 style={{ marginRight: 25 }}
//               >
//                 Total Blood Glucose Level After Meal - {bloodGlucoseLevel} mmol/L
//               </Text>

//               <Tooltip title="Edit" leaveTouchDelay={1000}>
//                 <IconButton
//                   icon="pencil"
//                   onPress={() => setModalVisibleAfterMeal(true)}
//                   iconColor={theme.colors.primary}
//                   size={15}
//                   style={{ margin: "-14px" }}
//                 />
//               </Tooltip>
//               <AddCarbsModal
//                 visible={modalVisibleAfterMeal}
//                 placeholder={"Edit Blood-glucose reading After Meal"}
//                 onDismiss={() => setModalVisibleAfterMeal(false)}
//                 onSave={handleSaveBloodGlucose}
//               />
//             </View>
//           ) : null}

//           {bloodGlucoseLevel ? (
//             <>
//               {bloodGlucoseLevel > targetBloodGlucose ? (
//                 <>
//                   <Text variant="titleMedium">
//                     Your correction dose - {getCorrectionFactor()}
//                   </Text>
//                   <Button
//                     mode="contained"
//                     onPress={() => navigation.navigate("Form")}
//                     style={styles.button}
//                   >
//                     Consult a Questionnaire
//                   </Button>
//                 </>
//               ) : (
//                 <Text variant="titleMedium">
//                   Your blood glucose is low - Take appropriate actions.
//                 </Text>
//               )}
//             </>
//           ) : null}

//           {bloodGlucoseLevel === 0 && foodItems?.length > 0 ? (
//             <>
//               <Button
//                 mode="contained"
//                 onPress={() => setModalVisibleAfterMeal(true)}
//                 style={styles.button}
//               >
//                 Add Blood Glucose Reading After Meal
//               </Button>
//               <AddCarbsModal
//                 visible={modalVisibleAfterMeal}
//                 placeholder={"Enter Blood Glucose Reading After Meal"}
//                 onDismiss={() => setModalVisibleAfterMeal(false)}
//                 onSave={handleSaveBloodGlucose}
//               />
//             </>
//           ) : null}
//         </View>
//       ) : null}
//       <Button
//         mode="contained"
//         onPress={() => navigation.navigate("EditMeal", { tag: tag })}
//         style={styles.button}
//       >
//         Edit Meal
//       </Button>
//     </View>
//   );
// };

// export default ViewFoodItem;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   emptyCartContainer: {
//     justifyContent: "center",
//     flex: 1,
//     alignItems: "center",
//   },
//   message: {
//     fontSize: 24,
//     marginBottom: 16,
//   },
//   messageICR: {
//     fontSize: 20,
//     marginTop: 18,
//     marginBottom: 10,
//   },
//   button: {
//     marginTop: 16,
//     width: '40%',
//     alignSelf: "center",
//   },

//   listSection: {
//     marginBottom: 16,
//   },
//   buttonStyle: {
//     position: "absolute",
//     bottom: 16,
//     left: 8,
//     right: 8,
//     padding: 16,
//   },
//   view: {
//     padding: 16,
//   },
//   activityIndicator: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addGlucose: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// import { StyleSheet, View, ScrollView } from "react-native";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { ActivityIndicator, Button, Divider, IconButton, List, Text, Tooltip, useTheme } from "react-native-paper";
// import AddCarbsModal from "../ui/addCarbsModal";
// import { firebase } from "../config";
// import { useIsFocused } from '@react-navigation/native';
// import { BASE_URL } from "@env";

// const ViewFoodItem = ({ navigation, route }) => {
//   const theme = useTheme();

//   const dispatch = useDispatch();
//   const isFocused = useIsFocused();
//   const user = useSelector(state => state.user);
//   const { tag } = route?.params;
//   const [objectId, setObjectId] = useState(null);
//   const [foodItems, setFoodItems] = useState([]);
//   const [totalCarbs, setTotalCarbs] = useState("");
//   const [insulinDose, setInsulinDose] = useState(0);
//   const [userCRR, setUserCRR] = useState(0);
//   const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState(0);
//   const [targetBloodGlucose, setTargetBloodGlucose] = useState(0);
//   const [bloodGlucoseLevelBeforeMeal, setBloodGlucoseLevelBeforeMeal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
//   const [modalVisibleAfterMeal, setModalVisibleAfterMeal] = useState(false);
//   const [userICR, setUserICR] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = firebase.auth().currentUser;

//       if (user) {
//         const userId = user.uid;
//         const userProfRef = firebase.firestore()
//           .collection("userProfile")
//           .doc(userId);

//         const userProf = await userProfRef.get();

//         if (userProf.exists) {
//           const userProfData = userProf.data();
//           setTargetBloodGlucose(userProfData.targetBloodGlucose);
//         } else {
//           console.log("User profile data not found.");
//         }
//       } else {
//         console.log("No user is currently logged in.");
//       }
//     };
//     fetchUserData();
//   });

//   const [userStateData, setUserStateData] = useState({});
//   const [weight, setWeight] = useState("");
//   const [height, setHeight] = useState("");
//   const [age, setAge] = useState("");
//   const [breakfastStartHour, setBreakfastStartHour] = useState({});
//   const [breakfastEndHour, setBreakfastEndHour] = useState({});
//   const [lunchStartHour, setLunchStartHour] = useState({});
//   const [lunchEndHour, setLunchEndHour] = useState({});
//   const [dinnerStartHour, setDinnerStartHour] = useState({});
//   const [dinnerEndHour, setDinnerEndHour] = useState({});
//   const [bfICR, setBfICR] = useState("");
//   const [lhICR, setLhICR] = useState("");
//   const [dnICR, setMICR] = useState("");
//   const [crr, setCRR] = useState("");
//   const [showSummary, setShowSummary] = useState(false);

//   useEffect(() => {
//     if (isFocused) {
//       const fetchUserData = async () => {
//         const user = firebase.auth().currentUser;

//         if (user) {
//           const userId = user.uid;
//           const userDocRef = firebase.firestore()
//             .collection("users")
//             .doc(userId);
//           const userProfRef = firebase.firestore()
//             .collection("userProfile")
//             .doc(userId);

//           const userDoc = await userDocRef.get();
//           const userProf = await userProfRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             setUserStateData(userData);
//             dispatch({
//               type: "userData",
//               payload: { userData },
//             });
//           } else {
//             console.log("User data not found.");
//           }

//           if (userProf.exists) {
//             const userProfData = userProf.data();
//             setWeight(userProfData.weight);
//             setHeight(userProfData.height);
//             setAge(userProfData.age);
//             setBreakfastStartHour(userProfData.breakfastStartHour);
//             setBreakfastEndHour(userProfData.breakfastEndHour);
//             setLunchStartHour(userProfData.lunchStartHour);
//             setLunchEndHour(userProfData.lunchEndHour);
//             setDinnerStartHour(userProfData.dinnerStartHour);
//             setDinnerEndHour(userProfData.dinnerEndHour);
//             setBfICR(userProfData.bfICR);
//             setLhICR(userProfData.lhICR);
//             setMICR(userProfData.dnICR);
//             setCRR(userProfData.crr);
//             setTargetBloodGlucose(userProfData.targetBloodGlucose);
//           } else {
//             console.log("User profile data not found.");
//           }
//         } else {
//           console.log("No user is currently logged in.");
//         }
//       };
//       fetchUserData();
//     }
//   }, [isFocused]);

//   const getUpdatedUserICR = async () => {
//     console.log("HER: ", user?.user?.uid, tag);
//     await axios
//       .get(`${BASE_URL}/api/updateUserICR`, {
//         params: {
//           userId: user?.user?.uid,
//           mealType: tag,
//         },
//       })
//       .then(res => {
//         console.log("Response from Update ICR: ", res);
//         setUserICR(res.data);
//       })
//       .catch(err => console.log("Err: ", err));
//   };

//   const getFoodItems = async () => {
//     let params = {
//       userId: user?.user?.uid,
//       mealType: tag,
//     };
//     setLoading(true);
//     await axios.get(`${BASE_URL}/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`)
//       .then(res => {
//         setLoading(false);
//         setFoodItems(res?.data ? res?.data?.mealItems : []);
//         setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
//         setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
//         setObjectId(res?.data ? res?.data?._id : null);
//         setBloodGlucoseLevel(
//           res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
//         );
//         setTargetBloodGlucose(
//           res?.data?.targetBloodGlucose ? res?.data?.targetBloodGlucose : 0
//         )
//         setUserCRR(res?.data?.userCRR);
//         console.log("This is the data: ", res.data)
//         console.log("This is crr: ", res?.data?.userCRR);
//         console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);
//         console.log("Data: ", res, res?.data ? res?.data?.mealItems : []);
//       }).catch(e => {
//         setLoading(false);
//         console.log("Error: ", e);
//       });
//   };

//   const addBloodGlucose = async data => {
//     let params = {
//       _id: objectId,
//       bloodGlucoseLevel: data,
//     };
//     setLoading(true);
//     await axios
//       .put(
//         `${BASE_URL}/api/addBloodGlucose`,
//         params
//       )
//       .then(res => {
//         setLoading(false);
//         navigation.goBack();
//       })
//       .catch(e => {
//         setLoading(false);
//         console.log("Error: ", e);
//       });
//   };

//   const addBloodGlucoseBeforeMeal = async data => {
//     let params = {
//       userId: user?.user?.uid,
//       mealType: tag,
//       bloodGlucoseBeforeMeal: data,
//     };
//     setLoading(true);
//     console.log("This the data we are saving for blood glucose:\n", params)
//     await axios
//       .post(
//         `${BASE_URL}/api/addBloodGlucoseBeforeMeal`,
//         params
//       )
//       .then(res => {
//         console.log("Blood Glucose Before Meal API Response: ", res);
//         setLoading(false);
//         navigation.goBack();
//       })
//       .catch(e => {
//         setLoading(false);
//         console.log("Error : ", e);
//       });
//   };

//   const getBloodGlucoseBeforeMeal = async () => {
//     let params = {
//       userId: user?.user?.uid,
//       mealType: tag,
//     };
//     setLoading(true);
//     await axios.get(`${BASE_URL}/api/getBloodGlucoseBeforeMeal?userId=${params.userId}&mealType=${params.mealType}&mealDate=${new Date().toLocaleDateString('en-GB')}`)
//       .then(res => {
//         setLoading(false);
//         setBloodGlucoseLevelBeforeMeal(
//           res?.data?.bloodGlucoseBeforeMeal ? res?.data?.bloodGlucoseBeforeMeal : 0
//         );
//         console.log("Getting data: ", res);
//         console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);

//       })
//       .catch(e => {
//         setLoading(false);
//         console.log("Error: ", e);
//       });
//   };

//   useEffect(() => {
//     getUpdatedUserICR();
//     getBloodGlucoseBeforeMeal();
//     getFoodItems();
//   }, []);

//   const handleSaveBloodGlucose = data => {
//     addBloodGlucose(data);
//     setModalVisibleAfterMeal(false);
//     setBloodGlucoseLevel(data);
//     console.log("Target: ", targetBloodGlucose, " Blood Glucose: ", bloodGlucoseLevel);
//   };

//   const handleSaveBloodGlucoseBeforeMeal = data => {
//     addBloodGlucoseBeforeMeal(data);
//     setModalVisibleBeforeMeal(false);
//   };

//   const getCarbs = item => {
//     let carbs = 0;
//     carbs = item.foodNutrients.find(y => {
//       return parseInt(y.number) === 205;
//     });
//     return carbs ? carbs.amount : 0;
//   };

//   const onAddFood = () => navigation.navigate("FoodSearch", { tag, fromEditMeal: false });

//   const updateUserICR = async () => {
//     console.log("Update UserICR");
//     try {
//       const user = firebase.auth().currentUser;
//       if (user) {
//         const userId = user.uid;
//         const userDocRef = firebase
//           .firestore()
//           .collection("userProfile")
//           .doc(userId);
//         let data = {};
//         if (tag === "Breakfast") {
//           data = {
//             bfICR: userICR,
//           };
//         } else if (tag === "Lunch") {
//           data = {
//             lhICR: userICR,
//           };
//         } else {
//           data = {
//             dnICR: userICR,
//           };
//         }
//         await userDocRef.set(data, { merge: true });
//         console.log("Data to Deliver: ", data);
//         alert("Updated successfully");
//       } else {
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const RightListView = ({ item }) => (
//     <View>
//       <Text style={styles.quantityText}>Quantity: {item?.count}</Text>
//     </View>
//   );

//   const getCorrectionFactor = () => {
//     try {
//       console.log(`Blood Glucose Level: ${bloodGlucoseLevel}`);
//       console.log(`Target Blood Glucose: ${targetBloodGlucose}`);
//       console.log('User CRR: ', userCRR);
//       const x = (bloodGlucoseLevel - targetBloodGlucose) / userCRR;
//       // Round to the nearest half
//       return Math.round(x * 2) / 2;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.mainContent}>
//         <View style={styles.leftContainer}>
//           {showSummary ? (
//             <List.Section style={styles.listSection}>
//               <List.Subheader>
//                 <Text style={styles.sectionHeader}>Today's {tag}</Text>
//               </List.Subheader>
//               {foodItems?.map((item, index) => (
//                 <List.Item
//                   key={index}
//                   titleEllipsizeMode="tail"
//                   titleNumberOfLines={5}
//                   title={item.description}
//                   description={`Carbs: ${getCarbs(item)}`}
//                   right={() => <RightListView item={item} />}
//                   style={styles.listItem}
//                 />
//               ))}
//             </List.Section>
//           ) : (
//             <View style={styles.emptyCartContainer}>
//               {loading ? (
//                 <ActivityIndicator size="large" style={styles.activityIndicator} color={theme.colors.primary} />
//               ) : (
//                 <>
//                   {foodItems.length > 0 && (
//                     <Text style={styles.message}>Food is already added. Check summary for more details.</Text>
//                   )}

//                   {bloodGlucoseLevelBeforeMeal === 0 && (
//                     <Button
//                       mode="contained"
//                       onPress={() => setModalVisibleBeforeMeal(true)}
//                       style={styles.button}
//                       labelStyle={styles.buttonLabel}
//                     >
//                       Add Blood Glucose Reading Before Meal
//                     </Button>
//                   )}
//                   <AddCarbsModal
//                     visible={modalVisibleBeforeMeal}
//                     placeholder={"Enter the reading Before Meal"}
//                     onDismiss={() => setModalVisibleBeforeMeal(false)}
//                     onSave={handleSaveBloodGlucoseBeforeMeal}
//                   />

//                   {foodItems.length <= 0 && (
//                     <>
//                       <Button
//                         mode="contained"
//                         onPress={onAddFood}
//                         style={styles.button}
//                         labelStyle={styles.buttonLabel}
//                       >
//                         Add Food Here
//                       </Button>
//                     </>
//                   )}
//                   <Button
//                     mode="contained"
//                     onPress={() => setShowSummary(!showSummary)}
//                     style={styles.button}
//                     labelStyle={styles.buttonLabel}
//                   >
//                     Summary For Meal
//                   </Button>
//                 </>
//               )}
//             </View>
//           )}
//           <Button
//             mode="contained"
//             onPress={() => navigation.navigate("EditMeal", { tag: tag })}
//             style={styles.button}
//             labelStyle={styles.buttonLabel}
//           >
//             Edit Meal
//           </Button>
//         </View>

//         <Divider style={styles.verticalDivider} />

//         <View style={styles.rightContainer}>
//           <Text style={styles.infoHeader}>User Information</Text>
//           <Text style={styles.infoText}>Weight: {weight} kg</Text>
//           <Text style={styles.infoText}>Height: {height} cm</Text>
//           <Text style={styles.infoText}>Age: {age} years</Text>
//           <Text style={styles.infoText}>Breakfast ICR: {bfICR}</Text>
//           <Text style={styles.infoText}>Lunch ICR: {lhICR}</Text>
//           <Text style={styles.infoText}>Dinner ICR: {dnICR}</Text>
//           <Text style={styles.infoText}>Correction Ratio: {crr}</Text>
//           <Text style={styles.infoText}>Target Blood Glucose: {targetBloodGlucose} mmol/L</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default ViewFoodItem;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f7f7f7",
//   },
//   mainContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   leftContainer: {
//     flex: 1,
//     paddingRight: 16,
//   },
//   rightContainer: {
//     flex: 1,
//     paddingLeft: 16,
//   },
//   verticalDivider: {
//     height: '100%',
//     width: 1,
//     backgroundColor: '#dddddd',
//     marginHorizontal: 16,
//   },
//   emptyCartContainer: {
//     justifyContent: "center",
//     flex: 1,
//     alignItems: "center",
//   },
//   message: {
//     fontSize: 18,
//     color: "#555555",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   button: {
//     marginTop: 16,
//     width: '80%',
//     alignSelf: "center",
//     backgroundColor: "#2346AD",
//   },
//   buttonLabel: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#ffffff",
//   },
//   listSection: {
//     marginBottom: 16,
//     backgroundColor: "#ffffff",
//     borderRadius: 8,
//     padding: 8,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333333",
//     marginBottom: 8,
//   },
//   listItem: {
//     marginVertical: 4,
//     backgroundColor: "#fafafa",
//     borderRadius: 8,
//     padding: 8,
//   },
//   quantityText: {
//     fontSize: 14,
//     color: "#777777",
//   },
//   activityIndicator: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   infoHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333333",
//     marginBottom: 16,
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#333333",
//     marginBottom: 8,
//   },
//   divider: {
//     marginVertical: 16,
//     height: 1,
//     backgroundColor: "#dddddd",
//   },
// });

import { StyleSheet, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Button, Divider, IconButton, List, Text, Tooltip, useTheme, Card, Avatar, TextInput } from "react-native-paper";
import AddCarbsModal from "../ui/addCarbsModal";
import { firebase } from "../config";
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL } from "@env";

const ViewFoodItem = ({ navigation, route }) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector(state => state.user);
  const { tag } = route?.params;
  const [objectId, setObjectId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState("");
  const [insulinDose, setInsulinDose] = useState(0);
  const [userCRR, setUserCRR] = useState(0);
  const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState(0);
  const [targetBloodGlucose, setTargetBloodGlucose] = useState(0);
  const [bloodGlucoseLevelBeforeMeal, setBloodGlucoseLevelBeforeMeal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
  const [modalVisibleAfterMeal, setModalVisibleAfterMeal] = useState(false);
  const [userICR, setUserICR] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [userMealData, setUserMealData] = useState([]);
  const [foodDetails, setFoodDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [manualCarbs, setManualCarbs] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [carbs, setCarbs] = useState('');



  useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;

      if (user) {
        const userId = user.uid;
        const userProfRef = firebase.firestore()
          .collection("userProfile")
          .doc(userId);

        const userProf = await userProfRef.get();

        if (userProf.exists) {
          const userProfData = userProf.data();
          setTargetBloodGlucose(userProfData.targetBloodGlucose);
        } else {
          console.log("User profile data not found.");
        }
      } else {
        console.log("No user is currently logged in.");
      }
    };
    fetchUserData();
  });

  const [userStateData, setUserStateData] = useState({});
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [age, setAge] = useState("");
  const [breakfastStartHour, setBreakfastStartHour] = useState({});
  const [breakfastEndHour, setBreakfastEndHour] = useState({});
  const [lunchStartHour, setLunchStartHour] = useState({});
  const [lunchEndHour, setLunchEndHour] = useState({});
  const [dinnerStartHour, setDinnerStartHour] = useState({});
  const [dinnerEndHour, setDinnerEndHour] = useState({});
  const [bfICR, setBfICR] = useState("");
  const [lhICR, setLhICR] = useState("");
  const [mICR, setMICR] = useState("");
  const [crr, setCRR] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  

  useEffect(() => {
    if (isFocused) {
      const fetchUserData = async () => {
        const user = firebase.auth().currentUser;

        if (user) {
          const userId = user.uid;
          const userDocRef = firebase.firestore()
            .collection("users")
            .doc(userId);
          const userProfRef = firebase.firestore()
            .collection("userProfile")
            .doc(userId);

          const userDoc = await userDocRef.get();
          const userProf = await userProfRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserStateData(userData);
            dispatch({
              type: "userData",
              payload: { userData },
            });
          } else {
            console.log("User data not found.");
          }

          if (userProf.exists) {
            const userProfData = userProf.data();
            setWeight(userProfData.weight);
            setHeightFt(userProfData.heightFt);
            setHeightIn(userProfData.heightIn);
            setAge(userProfData.age);
            setBreakfastStartHour(userProfData.breakfastStartHour);
            setBreakfastEndHour(userProfData.breakfastEndHour);
            setLunchStartHour(userProfData.lunchStartHour);
            setLunchEndHour(userProfData.lunchEndHour);
            setDinnerStartHour(userProfData.dinnerStartHour);
            setDinnerEndHour(userProfData.dinnerEndHour);
            setBfICR(userProfData.bfICR);
            setLhICR(userProfData.lhICR);
            setMICR(userProfData.mICR);
            setCRR(userProfData.crr);
            setTargetBloodGlucose(userProfData.targetBloodGlucose);
          } else {
            console.log("User profile data not found.");
          }
        } else {
          console.log("No user is currently logged in.");
        }
      };
      fetchUserData();
    }
  }, [isFocused]);

  const getUpdatedUserICR = async () => {
    console.log("HER: ", user?.user?.uid, tag);
    await axios
      .get(`${BASE_URL}/api/updateUserICR`, {
        params: {
          userId: user?.user?.uid,
          mealType: tag,
        },
      })
      .then(res => {
        console.log("Response from Update ICR: ", res);
        setUserICR(res.data);
      })
      .catch(err => console.log("Err: ", err));
  };

  const getFoodItems = async () => {
    let params = {
      userId: user?.user?.uid,
      mealType: tag,
    };
    setLoading(true);
    await axios.get(`${BASE_URL}/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`)
      .then(res => {
        setLoading(false);
        setFoodItems(res?.data ? res?.data?.mealItems : []);
        setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
        setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
        setObjectId(res?.data ? res?.data?._id : null);
        setBloodGlucoseLevel(
          res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
        );
        setTargetBloodGlucose(
          res?.data?.targetBloodGlucose ? res?.data?.targetBloodGlucose : 0
        )
        setUserCRR(res?.data?.userCRR);
        console.log("This is the data: ", res.data)
        console.log("This is crr: ", res?.data?.userCRR);
        console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);
        console.log("Data: ", res, res?.data ? res?.data?.mealItems : []);
      }).catch(e => {
        setLoading(false);
        console.log("Error: ", e);
      });
  };

  // const addBloodGlucose = async data => {
  //   let params = {
  //     _id: objectId,
  //     bloodGlucoseLevel: data,
  //   };
  //   setLoading(true);
  //   await axios
  //     .put(
  //       `${BASE_URL}/api/addBloodGlucose`,
  //       params
  //     )
  //     .then(res => {
  //       setLoading(false);
  //       navigation.goBack();
  //     })
  //     .catch(e => {
  //       setLoading(false);
  //       console.log("Error: ", e);
  //     });
  // };

  // const addBloodGlucoseBeforeMeal = async data => {
  //   let params = {
  //     userId: user?.user?.uid,
  //     mealType: tag,
  //     bloodGlucoseBeforeMeal: data,
  //   };
  //   setLoading(true);
  //   console.log("This the data we are saving for blood glucose:\n", params)
  //   await axios
  //     .post(
  //       `${BASE_URL}/api/addBloodGlucoseBeforeMeal`,
  //       params
  //     )
  //     .then(res => {
  //       console.log("Blood Glucose Before Meal API Response: ", res);
  //       setLoading(false);
  //       navigation.goBack();
  //     })
  //     .catch(e => {
  //       setLoading(false);
  //       console.log("Error : ", e);
  //     });
  // };

  const getBloodGlucoseBeforeMeal = async () => {
    let params = {
      userId: user?.user?.uid,
      mealType: tag,
    };
    setLoading(true);
    await axios.get(`${BASE_URL}/api/getBloodGlucoseBeforeMeal?userId=${params.userId}&mealType=${params.mealType}&mealDate=${new Date().toLocaleDateString('en-GB')}`)
      .then(res => {
        setLoading(false);
        setBloodGlucoseLevelBeforeMeal(
          res?.data?.bloodGlucoseBeforeMeal ? res?.data?.bloodGlucoseBeforeMeal : 0
        );
        console.log("Getting data: ", res);
        console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);

      })
      .catch(e => {
        setLoading(false);
        console.log("Error: ", e);
      });
  };

  useEffect(() => {
    getUpdatedUserICR();
    getBloodGlucoseBeforeMeal();
    getFoodItems();
  }, []);

  // const handleSaveBloodGlucose = data => {
  //   addBloodGlucose(data);
  //   setModalVisibleAfterMeal(false);
  //   setBloodGlucoseLevel(data);
    
  // };

  // useEffect(() => {
  //   console.log("Target: ", targetBloodGlucose, " Blood Glucose: ", bloodGlucoseLevel);
  //   if(targetBloodGlucose < bloodGlucoseLevel ){
  //      alert(" Blood glucose value is above the target");
  //   }
  // }, [bloodGlucoseLevel]);

  // const handleSaveBloodGlucoseBeforeMeal = data => {
  //   addBloodGlucoseBeforeMeal(data);
  //   setModalVisibleBeforeMeal(false);
  // };

  const getCarbs = item => {
    let carbs = 0;
    carbs = item.foodNutrients.find(y => {
      return parseInt(y.number) === 205;
    });
    return carbs ? carbs.amount : 0;
  };

  // const onAddFood = mealType => navigation.navigate("FoodSearch", { tag: mealType, fromEditMeal: false });
  
  const onAddFood = () => {console.log(tag)
    navigation.navigate("FoodSearch", { tag, fromEditMeal: false })
  };


  const updateUserICR = async () => {
    console.log("Update UserICR");
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = firebase
          .firestore()
          .collection("userProfile")
          .doc(userId);
        let data = {};
        if (tag === "Breakfast") {
          data = {
            bfICR: userICR,
          };
        } else if (tag === "Lunch") {
          data = {
            lhICR: userICR,
          };
        } else {
          data = {
            mICR: userICR,
          };
        }
        await userDocRef.set(data, { merge: true });
        console.log("Data to Deliver: ", data);
        alert("Updated successfully");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const RightListView = ({ item }) => (
    <View>
      <Text style={styles.quantityText}>Quantity: {item?.count}</Text>
    </View>
  );

  const getCorrectionFactor = () => {
    try {
      console.log(`Blood Glucose Level: ${bloodGlucoseLevel}`);
      console.log(`Target Blood Glucose: ${targetBloodGlucose}`);
      console.log('User CRR: ', userCRR);
      const x = (bloodGlucoseLevel - targetBloodGlucose) / userCRR;
      // Round to the nearest half
      return Math.round(x * 2) / 2;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // const handleSaveCarbs = carbs => {
  //   setModalVisible(false);
  //   let currentData = foodDetails?.foodNutrients?.find(x => parseInt(x.number) === 205);
  //   let newData = { ...currentData, amount: Number(carbs) };
  //   let newArray = foodDetails?.foodNutrients.map(item => parseInt(item.number) === 205 ? newData : item);
  //   let newFoodDetails = { ...foodDetails, foodNutrients: newArray };
  //   addFood(newFoodDetails, 1);
  // };

  const handleCarbsChange = (value) => {
    setManualCarbs(value);
  };

  // Handler to save the carbs value and navigate to FoodCart
  const handleSaveCarbs = () => {
    const carbAmount = parseInt(manualCarbs, 10);
    if (isNaN(carbAmount) || carbAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid carb amount');
      return;
    }

    
    setSaveMessage(`Carbs saved: ${carbAmount}`);

    // Navigate to the FoodCart after saving
    navigation.navigate('FoodCart', { manualCarbs: carbAmount, tag: tag });
  };     



  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
      {(foodItems && foodItems.length <= 0) && (
  <>
    <Text>No food items available</Text>
  </>
)}
      {/* {["Breakfast","Lunch","Dinner"].map(mealType => (
          <List.Accordion
            key={mealType}
            title={mealType}
            titleStyle={styles.accordionTitle}
           // expanded={selectedDay === data.mealDate}
            onPress={() => {
               //handleDaySelect(new Date().toLocaleDateString("en-GB"));
               //fetchBloodGlucoseBeforeMeal(firebase.auth().currentUser.uid, new Date().toLocaleDateString("en-GB"));
            }}
            style={[styles.accordionItem, styles.selectedItem]}
            left={props => <Avatar.Icon {...props} icon="calendar" style={styles.icon} color="white" />} */}
          {/* > */}
            {/* <Button
                      mode="contained"
                      onPress={() => setModalVisibleBeforeMeal(true)}
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                    >
                      Add Blood Glucose Reading Before Meal
            </Button> */}
                  {/* <AddCarbsModal
                    visible={modalVisibleBeforeMeal}
                    placeholder={"Enter the reading Before Meal"}
                    onDismiss={() => setModalVisibleBeforeMeal(false)}
                    onSave={bloodGlucose => handleSaveBloodGlucoseBeforeMeal(bloodGlucose, mealType)}
                  /> */}
                  <Button
                        mode="contained"
                        onPress= {onAddFood}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                      >
                        Add Food Here
                      </Button>

                      <TextInput
        style={styles.input}
        placeholder="Enter carbs"
        keyboardType="numeric"
        value={manualCarbs}
        onChangeText={handleCarbsChange}
      />

      {/* Save Button */}
      <Button
        mode="contained"
        onPress={handleSaveCarbs}  // Trigger save function on press
        style={styles.button}  // Custom button style
        labelStyle={styles.buttonLabel}  // Custom label style
      >
        Save Carbs
      </Button>

      {/* Success Message after saving */}
      {saveMessage ? <Text style={styles.message}>{saveMessage}</Text> : null}
             
             {/* (
              <View style={[styles.mealRow, { marginTop: 16 }]}>
                {userMealData.map(mealData => (
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
                ))}
              </View> */}
            
          {/* </List.Accordion>
        ))}  */}
              
         
        {/* <View style={styles.leftContainer}>
          {showSummary ? (
            <>
              <List.Section style={styles.listSection}>
                <List.Subheader>
                  <Text style={styles.sectionHeader}>Today's {tag}</Text>
                </List.Subheader>
                {foodItems?.map((item, index) => (
                  <List.Item
                    key={index}
                    titleEllipsizeMode="tail"
                    titleNumberOfLines={5}
                    title={item.description}
                    description={`Carbs: ${getCarbs(item)}`}
                    right={() => <RightListView item={item} />}
                    style={styles.listItem}
                  />
                ))}
              </List.Section>
              <View style={styles.view}>
                {totalCarbs > 0 && (
                  <Text variant="titleMedium">
                    Total Carbs Consumed - {Number(totalCarbs).toFixed(2)} g
                  </Text>
                )}

                {insulinDose > 0 && (
                  <Text variant="titleMedium">
                    Total Insulin Dose - {insulinDose} units
                  </Text>
                )}

                {bloodGlucoseLevel > 0 && (
                  <>
                    {bloodGlucoseLevel > targetBloodGlucose ? (
                      <>
                        <Text variant="titleMedium">
                          Your correction dose - {getCorrectionFactor()}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text variant="titleMedium">
                          Your blood glucose is low - Take appropriate actions.
                        </Text>
                      </>
                    )}
                  </>
                )}
              </View>
              {bloodGlucoseLevel > 0 && (
                <>
                  {bloodGlucoseLevel > targetBloodGlucose ? (
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate("Form")}
                      style={styles.button}
                    >
                      Consult a Questionnaire
                    </Button>
                  ) : (
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate("Form")}
                      style={styles.button}
                    >
                      Consult a Questionnaire
                    </Button>
                  )}
                </>
              )}

              {bloodGlucoseLevel === 0 && foodItems?.length > 0 && (
                <>
                  <Button
                    mode="contained"
                    onPress={() => setModalVisibleAfterMeal(true)}
                    style={styles.button}
                  >
                    Add Blood Glucose Reading After Meal
                  </Button>
                  <AddCarbsModal
                    visible={modalVisibleAfterMeal}
                    placeholder={"Enter Blood Glucose Reading After Meal"}
                    onDismiss={() => setModalVisibleAfterMeal(false)}
                    onSave={handleSaveBloodGlucose}
                  />
                </>
              )}
            </>
          ) : (
            <View style={styles.emptyCartContainer}>
              {loading ? (
                <ActivityIndicator size="large" style={styles.activityIndicator} color={theme.colors.primary} />
              ) : (
                <>
                  {foodItems.length > 0 && (
                    <Text style={styles.message}>Food is already added. Check summary for more details.</Text>
                  )}

                  {bloodGlucoseLevelBeforeMeal === 0 && (
                    <Button
                      mode="contained"
                      onPress={() => setModalVisibleBeforeMeal(true)}
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                    >
                      Add Blood Glucose Reading Before Meal
                    </Button>
                  )}
                  <AddCarbsModal
                    visible={modalVisibleBeforeMeal}
                    placeholder={"Enter the reading Before Meal"}
                    onDismiss={() => setModalVisibleBeforeMeal(false)}
                    onSave={handleSaveBloodGlucoseBeforeMeal}
                  />
                  <Button
                    mode="contained"
                    onPress={() => setShowSummary(!showSummary)}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                  >
                    Summary For Meal
                  </Button>
                </>
              )}
            </View>
          )}
          <Button
            mode="contained"
            onPress={() => navigation.navigate("EditMeal", { tag: tag })}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Edit Meal
          </Button>
        </View> */}

        {/* <Divider style={styles.horizontalDivider} />

        <View style={styles.rightContainer}>
          <Card style={styles.card}>
             <Card.Title
              title="User Information"
              left={(props) => <Avatar.Icon {...props} icon="account" />}
            /> 
            <Card.Content>
              

              {tag === "Breakfast" && <Text style={styles.infoText}>Breakfast ICR: {bfICR}</Text>}
              {tag === "Lunch" && <Text style={styles.infoText}>Lunch ICR: {lhICR}</Text>}
              {tag !== "Breakfast" && tag !== "Lunch" && <Text style={styles.infoText}>Dinner ICR: {dnICR}</Text>}
               <Text style={styles.infoText}>Correction Ratio: {crr}</Text>
              <Text style={styles.infoText}>Target Blood Glucose: {targetBloodGlucose} mmol/L</Text> 
              {bloodGlucoseLevelBeforeMeal > 0 && (
                <View variant="titleMedium" style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text variant="titleMedium" style={{ marginRight: 25 }}>
                    Total Blood Glucose Level Before Meal - {bloodGlucoseLevelBeforeMeal} mmol/L
                  </Text>
                  <Tooltip title="Edit" leaveTouchDelay={1000}>
                    <IconButton
                      icon="pencil"
                      onPress={() => setModalVisibleBeforeMeal(true)}
                      iconColor={theme.colors.primary}
                      size={15}
                      style={{ margin: "-14px" }}
                    />
                  </Tooltip>
                </View>
              )}
              <AddCarbsModal
                visible={modalVisibleBeforeMeal}
                placeholder={"Edit Blood Glucose Reading Before Meal"}
                onDismiss={() => setModalVisibleBeforeMeal(false)}
                onSave={handleSaveBloodGlucoseBeforeMeal}
              />  */}

              {/* {bloodGlucoseLevel > 0 && (
                <View variant="titleMedium" style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text variant="titleMedium" style={{ marginRight: 25 }}>
                    Total Blood Glucose Level After Meal - {bloodGlucoseLevel} mmol/L
                  </Text>
                  <Tooltip title="Edit" leaveTouchDelay={1000}>
                    <IconButton
                      icon="pencil"
                      onPress={() => setModalVisibleAfterMeal(true)}
                      iconColor={theme.colors.primary}
                      size={15}
                      style={{ margin: "-14px" }}
                    />
                  </Tooltip>
                  <AddCarbsModal
                    visible={modalVisibleAfterMeal}
                    placeholder={"Edit Blood Glucose Reading After Meal"}
                    onDismiss={() => setModalVisibleAfterMeal(false)}
                    onSave={handleSaveBloodGlucose}
                  />
                </View>
              )}
            </Card.Content>
          </Card>
        </View> */}
      </View>
    </ScrollView >
  );
};

export default ViewFoodItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  mainContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    paddingRight: 16,
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  // horizontalDivider: {
  //   width: '100%',
  //   height: 1,
  //   backgroundColor: '#dddddd',
  //   marginVertical: 16,
  // },
  emptyCartContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    color: "#555555",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    width: '70%',
    alignSelf: "center",
    backgroundColor: "#2346AD",
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  listSection: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  listItem: {
    marginVertical: 4,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    color: "#777777",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
    height: 1,
    backgroundColor: "#dddddd",
  },
  view: {
    alignSelf: "center"
  }
});