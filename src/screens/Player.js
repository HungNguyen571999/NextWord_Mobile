import React, { Component } from 'react';
import {
    Dimensions, View, Text, StyleSheet, StatusBar,
    ImageBackground, Alert, Modal, Image, ScrollView, TouchableOpacity
} from 'react-native';
import { IconButton, Colors, Button } from 'react-native-paper';
import ListCard from '../Components/Player/ListCard';
import ModalCard from '../Components/Player/ModalCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuButton from '../Components/MenuButton';
import { connect } from 'react-redux';
import io from "socket.io-client";
import { baseURL } from '../shared/baseURL';
import { socket } from './New_Join_Game';
import Modal_Leave_Room from '../Components/Player/Modal_Leave_Room';
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        room: state.roomReducer.room,
    }
}
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInLobby: [],
            modalVisible: false,
        }
        // socket.on("start", msg => {
        //     this.props.navigation.navigate('Play_Game', {
        //         userCount: this.state.userInLobby.length
        //     });
        // })

    }
    startClick() {
        this.props.navigation.navigate('CountDown_StartPlay', {userInLobby: this.state.userInLobby});
        socket.emit('startPress', this.props.room.roomPin);
    }
    static navigationOptions = {
        title: 'Player',
    };
    componentDidMount() {
        socket.on('userInLobby', msg => {
            //console.info(msg);
            //msg is array user
            this.setState({
                userInLobby: msg,
            })
        });
        socket.on('start', msg => {
            this.props.navigation.navigate('CountDown_StartPlay', {userInLobby: this.state.userInLobby});
        })
    };
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {
        //console.log("user-player" + this.props.room);
        const { navigate } = this.props.navigation;
        const { modalVisible } = this.state;
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require("../images/back2.png")}
                    style={styles.image}>
                    <View>
                        <StatusBar 
                        barStyle="light-content" 
                        backgroundColor="transparent" 
                        translucent={true} />
                    </View>
                    <View style={styles.header}>
                        <TouchableOpacity style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                            onPress={() => {                               
                                this.setModalVisible(true);
                            }}>

                            <Icon name="chevron-left" size={width * 0.1094//45w
                            } color="#ffffff"
                            />
                        </TouchableOpacity>
                        <View>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    Alert.alert("Modal is closed");
                                }}
                            >
                                <Modal_Leave_Room
                                    navigation={this.props.navigation}
                                    onPress={() => {
                                        this.setModalVisible(!modalVisible);
                                    }}
                                />
                            </Modal>
                        </View>

                        <MenuButton avatarURL={this.props.user.photo}
                            navigation={this.props.navigation}></MenuButton>

                    </View>
                    <View style={styles.headerContent}>
                        <Text
                            style={{
                                fontSize: width * 0.1459,//60w
                                color: "#FFF",
                                fontWeight: 'bold'
                            }}>
                            LOBBY
                        </Text>
                        <View style={{ flexDirection: "row", }}>
                            <Text
                                style={{
                                    fontSize: width * 0.0973,//40w
                                    color: "#FFF",
                                }}>
                                Game ID is
                        </Text>
                            <Text
                                style={{

                                    fontSize: width * 0.0973,//40w
                                    color: "#FFF",
                                }}>
                                _
                        </Text>
                            <Text
                                style={{
                                    fontSize: width * 0.0973,//40w
                                    color: "#f2c026",
                                    fontWeight: 'bold'
                                }}>
                                {this.props.room.roomPin}
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: width * 0.0608,
                                color: "#b1a7b9",
                            }}>
                            {this.state.userInLobby.length}/10 player
                        </Text>
                    </View>

                    <View
                        style={styles.Icon}>
                        <Icon name="account-circle" size={height * 0.041} color="#5454bd" />
                        <Icon name="check-circle" size={height * 0.041} color="#5454bd" />
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 1,
                        }}>
                        {
                            this.state.userInLobby.map((item, index) => (
                                <ListCard key={index} you={this.props.user.id} item={item}>

                                </ListCard>))
                        }
                        {/* <View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    Alert.alert("Modal is closed");
                                }}
                            >
                                <ModalCard
                                    onPress={() => {
                                        this.setModalVisible(!modalVisible);
                                    }}
                                />
                            </Modal>
                        </View> */}
                    </ScrollView>
                    <View style={{}}>
                        <Button
                        disabled={this.props.room.ownerId !== this.props.user.id}
                            color="#5454bd"
                            icon={require('../images/finish.png')}
                            mode="contained"
                            onPress={() => this.startClick()}>
                            <Text style={{
                                color: this.props.room.ownerId === this.props.user.id ? '#FFF' : "#b1a7b9",
                                fontSize: width * 0.0608,

                            }}>
                                {this.props.room.ownerId === this.props.user.id ? 'Start' : 'Waiting...'}
                        </Text>
                        </Button>
                    </View>

                </ImageBackground>

            </View>
        );
    }
}

export default connect(mapStateToProps)(Player);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: "column"
    },
    image: {
        width: "100%",
        height: "100%",
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: width * 0.073,//30w
        marginTop: height * 0.0585,//40h 
        marginBottom: height * 0.01464,//10h
        justifyContent: "space-between",
        alignItems: "center",
    },

    imageBack: {
        tintColor: "#fff",
        width: width * 0.0729,//30w
        height: height * 0.0292,//20h
    },
    
    headerContent: {
        flexDirection: 'column',
        alignItems: "center",
        // marginBottom: height * 0.0732,
    },
    Icon: {
        marginTop: height * 0.07321,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: width * 0.1216,//50w
    }
});