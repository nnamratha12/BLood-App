import { StyleSheet, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Button, Divider, IconButton, List, Text, Tooltip, useTheme, Card, Avatar } from "react-native-paper";
import AddCarbsModal from "../ui/addCarbsModal";
import { firebase } from "../config";
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL } from "@env";

const ViewFood = ({ navigation, route }) => {
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
    const [tags, setTag] = useState(null);
    const [bloodGlucoseBeforeMeal, setBloodGlucoseBeforeMeal] = useState(0)
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

   

    const addBloodGlucose = async data => {
        let params = {
            _id: objectId,
            bloodGlucoseLevel: data,
        };
        setLoading(true);
        await axios
            .put(
                `${BASE_URL}/api/addBloodGlucose`,
                params
            )
            .then(res => {
                setLoading(false);
                navigation.goBack();
            })
            .catch(e => {
                setLoading(false);
                console.log("Error: ", e);
            });
    };

    const addBloodGlucoseBeforeMeal = async data => {
        let params = {
            userId: user?.user?.uid,
            mealType: tags,
            bloodGlucoseBeforeMeal: data,
        };
        setLoading(true);
        console.log("This the data we are saving for blood glucose:\n", params)
        await axios
            .post(
                `${BASE_URL}/api/addBloodGlucoseBeforeMeal`,
                params
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
    
    const handleSaveBloodGlucose = data => {
        addBloodGlucose(data);
        setModalVisibleAfterMeal(false);
        setBloodGlucoseLevel(data);

    };

    useEffect(() => {
        console.log("Target: ", targetBloodGlucose, " Blood Glucose: ", bloodGlucoseLevel);
        if (targetBloodGlucose < bloodGlucoseLevel) {
            alert(" Blood glucose value is above the target");
        }
    }, [bloodGlucoseLevel]);

    const handleSaveBloodGlucoseBeforeMeal = data => {
        addBloodGlucoseBeforeMeal(data);
        setModalVisibleBeforeMeal(false);
    };

    const getCarbs = item => {
        let carbs = 0;
        carbs = item.foodNutrients.find(y => {
            return parseInt(y.number) === 205;
        });
        return carbs ? carbs.amount : 0;
    };

    const onAddFood = mealItems => navigation.navigate("FoodSearch", { tag: mealItems, fromEditMeal: false });

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

    const handleDaySelect = day => {
        if (selectedDay === day) {
          setSelectedDay(null);
        } else {
          setSelectedDay(day);
          console.log("Day: ", day);
          axios.get(`${BASE_URL}/api/getDataByDate`, {
            params: {
              userId: user?.user?.uid,
              mealDate: new Date().toLocaleDateString('en-GB'),
            },
          }).then(res => {
            console.log("Data: ", res);
            setUserMealData(res.data);
          }).catch(err => console.log("err: ", err));
        }
      };

      const handleToggleSummary = (mealType) => {
         setTag (mealType); // Set the tag based on selected meal type
        setShowSummary(true); // Toggle summary view
    };

    useEffect(() => {
        if (showSummary) {
            console.log(`Showing summary for: ${tag}`);
        }
    }, [showSummary, tag]);

    const fetchBloodGlucoseBeforeMeal = async (userId, mealDate) => {
        axios.get(`${BASE_URL}/api/getAllBloodGlucoseBeforeMeal`, {
          params: {
            userId,
            mealDate,
          },
        }).then(response => {
          console.log("Response from getAllBloodGlucoseBeforeMeal: ", response.data);
          setBloodGlucoseBeforeMeal(response.data);
        }).catch(error => console.log("Error fetching blood glucose before meal: ", error));
      };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.mainContent}>
            <View style={styles.leftContainer}> 
                    {console.log(`showSummary: ${showSummary}`)}
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
                                        onSave={bloodGlucoseLevel=> handleSaveBloodGlucoseBeforeMeal(bloodGlucoseLevel, mealType)}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <View style={styles.emptyCartContainer}>
                            {console.log(`Is Loading?: ${loading}`)}
                            {loading ? (
                                <ActivityIndicator size="large" style={styles.activityIndicator} color={theme.colors.primary} />
                            ) : (
                                <>
                                    {foodItems.length > 0 && (
                                        <Text style={styles.message}>Food is already added. Check summary for more details.</Text>
                                    )}

                                    {/* {bloodGlucoseLevelBeforeMeal === 0 && (
                    <Button
                      mode="contained"
                      onPress={() => setModalVisibleBeforeMeal(true)}
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                    >
                      Add Blood Glucose Reading Before Meal
                    </Button>
                  )} */}
                                    {/* <AddCarbsModal
                    visible={modalVisibleBeforeMeal}
                    placeholder={"Enter the reading Before Meal"}
                    onDismiss={() => setModalVisibleBeforeMeal(false)}
                    onSave={handleSaveBloodGlucoseBeforeMeal}
                  /> */}

                                    {/* {foodItems.length <= 0 && (
                    <>
                      <Button
                        mode="contained"
                        onPress={onAddFood}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                      >
                        Add Food Here
                      </Button>
                    </>
                  )} */}

                                    {/* <Button
                    mode="contained"
                    onPress={() => setShowSummary(!showSummary)}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                  >
                    Summary For Meal
                  </Button> */}

 {["Breakfast","Lunch","Dinner"].map(mealType => (
          <List.Accordion
            key={mealType}
            title={mealType}
            titleStyle={styles.accordionTitle}
        //    expanded={selectedDay === mealType}
            onPress={() => {
             handleDaySelect(mealType);
             fetchBloodGlucoseBeforeMeal(firebase.auth().currentUser.uid, new Date().toLocaleDateString("en-GB"));
            }}
            style={[styles.accordionItem, styles.selectedItem]}
            left={props => <Avatar.Icon {...props} icon="calendar" style={styles.icon} color="white" />}
          >

{/* <Button
                    mode="contained"
                    onPress={() =>{
                        handleToggleSummary(mealType);
                        setShowSummary(!showSummary);
                    }}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                  >
                    Summary For Meal
                  </Button> */}
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
                                                    onSave={bloodGlucose => handleSaveBloodGlucose(bloodGlucose, mealType)}
                                                />
                                                
                                                {/* <Button
                        mode="contained"
                        onPress={() => navigation.navigate("EditMeal", { tag: tag })}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Edit Meal
                    </Button> */}
    
              
            {/* <Button
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
                    onSave={bloodGlucose => handleSaveBloodGlucoseBeforeMeal(bloodGlucose, mealType)}
                  /> */}
             {selectedDay === mealType && (
              <View style={[styles.mealColumn, { marginTop: 16 }]}>
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
              </View>
            )} 
          </List.Accordion>
        ))}

                                    <>
                                        <List.Section style={styles.listSection}>
                                            {/* <List.Subheader>
                                                <Text style={styles.sectionHeader}>Today's {tag}</Text>
                                            </List.Subheader> */}
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
                                                    onSave={bloodGlucose => handleSaveBloodGlucose(bloodGlucose, mealType)}
                                                />
                                            </>
                                        )}
                                    </>

                                </>
                            )}
                        </View>
                    )}
                    {/* <Button
                        mode="contained"
                        onPress={() => navigation.navigate("EditMeal", { tag: tag })}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Edit Meal
                    </Button>  */}
                </View>

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
                            {tag !== "Breakfast" && tag !== "Lunch" && <Text style={styles.infoText}>Dinner ICR: {mICR}</Text>}
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
                                onSave={bloodGlucose => handleSaveBloodGlucoseBeforeMeal(bloodGlucose, mealType)}
                            />

                            {bloodGlucoseLevel > 0 && (
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
                                        onSave={bloodGlucose => handleSaveBloodGlucoseBeforeMeal(bloodGlucose, mealType)}
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

export default ViewFood;

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
    //     height: '100%',
    //     width: 1,
    //     backgroundColor: '#dddddd',
    //     marginVertical: 16,
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