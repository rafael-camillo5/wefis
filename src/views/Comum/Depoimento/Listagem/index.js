import React from "react";
import {
    View,
    StatusBar,
    FlatList, ScrollView
} from "react-native";

import Block from "../../../../components/Pattern/Block";
import {theme} from "../../../../utils/constants";
import styles from './style';
import * as actions from "../../../../store/actions";
import {connect} from "react-redux";
import {listagemDepoimento as initialState} from "../../../../utils/constants";
import update from "immutability-helper";
import FooterToolbar from "../../../../components/Pattern/FooterToolbar";
import Card from "../../../../components/Pattern/Card";
import Header from "../../../../components/Pattern/Header";
import EmptyList from "../../../../components/Pattern/EmptyList";
import formatterConstant from "../../../../utils/function/formatterConstant";

class ListagemDepoimento extends React.Component {
    constructor(props) {
        super(props);
        this.state = formatterConstant(initialState);
    }

    componentDidMount() {
        this.props.checkToken(this.props.navigation);

        this.setState(
            update(this.state, {
                depoimentos: {$set: this.mapData(this.props.depoimentos)}
            })
        );
    };

    componentDidUpdate(prevProps, _prevState, _snapshot) {
        if(prevProps.depoimentos !== this.props.depoimentos) {
            this.setState(
                update(this.state, {
                    depoimentos: {$set: this.mapData(this.props.depoimentos)}
                })
            );
        }
    }

    cb = (type) => {
        this.setState(
            update(this.state, {
                request: {
                    $toggle: ['loading']
                }
            })
        );
    };

    onPrepareViewMore = async (item) => {
        this.props.onPrepareViewMoreDepoimento(item, this.props.navigation);
    };

    mapData = data => {
        const list = [];

        if(data) {
            Object.keys(data).forEach(key => {
                const depoimento = data[key];

                if(depoimento.status.aprovado) {
                    list.push({...depoimento, _id: key})
                }
            });
        }

        return list;
    };

    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle={theme.MODE.BARSTYLE} backgroundColor={theme.COLORS.PRIMARY} />

                <Header navigation={this.props.navigation} rota="Menu" statusPage="Depoimentos" rotaAdd="RealizarDepoimento" listagem tipo="comum" />

                <ScrollView horizontal={false} style={styles.scrollContainer}>
                    <View style={styles.flatlist}>
                        {this.state.depoimentos.length > 0 ?
                            <FlatList data={this.state.depoimentos} renderItem={({item}) =>
                                <>
                                    <View style={styles.body}>
                                        <Block style={styles.block}>
                                            <Card key={item._id} item={item} horizontal
                                                  navigation={this.props.navigation} rota=""
                                                  onPrepareViewMore={() => this.onPrepareViewMore(item)} listagem={"depoimento"} tipo="comum" />
                                        </Block>
                                    </View>
                                </>
                            } keyExtractor={item => String(item._id)}/>
                            : <EmptyList message="Nenhum depoimento encontrado..." />
                        }
                    </View>
                </ScrollView>

                <FooterToolbar navigation={this.props.navigation} />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    depoimentos: state.depoimentos.depoimentos
});

const mapDispatchToProps = dispatch => ({
    onPrepareViewMoreDepoimento: (item, navigation) => dispatch(actions.prepareViewMoreDepoimento(item, navigation)),
    checkToken: (navigation) => dispatch(actions.checkToken(navigation))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListagemDepoimento);
